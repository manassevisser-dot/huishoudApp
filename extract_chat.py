import argparse
import logging
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup, FeatureNotFound

# Configureer logging
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

def clean_whitespace(text: str) -> str:
    """
    Schoont witruimte op, behoudt alinea's/berichten.
    """
    # Vervang 3 of meer enters door 2 (zodat berichten gescheiden blijven maar niet te ver uit elkaar)
    text = re.sub(r'\n{3,}', '\n\n', text)
    lines = [line.strip() for line in text.splitlines()]
    return "\n".join(lines).strip()

def extract_text(input_html: Path, selector: str = None) -> str:
    """
    Haalt tekst uit HTML, optioneel gefilterd op een CSS selector (ID of Class).
    """
    try:
        html_content = input_html.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        logger.error(f"❌ Fout bij lezen bestand: {e}")
        sys.exit(1)

    try:
        soup = BeautifulSoup(html_content, "lxml")
    except FeatureNotFound:
        soup = BeautifulSoup(html_content, "html.parser")

    # Verwijder technische rommel
    for tag in soup(["script", "style", "noscript", "template", "svg"]):
        tag.decompose()

    # --- LOGICA VOOR SELECTOR ---
    if selector:
        # Dit is de Python-versie van document.querySelector(selector)
        target_element = soup.select_one(selector)
        
        if target_element:
            logger.info(f"🎯 Element gevonden: '{selector}'")
            # Gebruik dat element als de nieuwe bron
            soup = target_element
        else:
            logger.warning(f"⚠️  Element '{selector}' niet gevonden in het bestand.")
            logger.warning("   -> De hele pagina wordt geëxtraheerd als fallback.")

    # separator="\n" is cruciaal voor chats, anders plakken berichten aan elkaar
    text = soup.get_text(separator="\n")
    
    return clean_whitespace(text)

def main():
    parser = argparse.ArgumentParser(description="Extract chat logs from HTML.")
    parser.add_argument("input", type=Path, help="Het HTML bestand")
    parser.add_argument("output", type=Path, nargs="?", help="Output TXT bestand")
    
    # Hier voegen we de selector optie toe
    parser.add_argument(
        "--selector", "-s", 
        type=str, 
        default=None, 
        help="CSS selector (bijv: '#chat-history' of '.message-body')"
    )

    args = parser.parse_args()

    if not args.input.exists():
        logger.error(f"❌ Bestand niet gevonden: {args.input}")
        sys.exit(2)

    output_path = args.output if args.output else args.input.with_suffix(".txt")

    # Roep de functie aan met de selector
    clean_text = extract_text(args.input, args.selector)

    try:
        output_path.write_text(clean_text, encoding="utf-8")
        logger.info(f"✅ Opgeslagen in: {output_path}")
    except IOError as e:
        logger.error(f"❌ Kon niet schrijven: {e}")

if __name__ == "__main__":
    main()