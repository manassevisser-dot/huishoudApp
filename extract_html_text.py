
import sys
from bs4 import BeautifulSoup
from pathlib import Path

def extract_text(input_html: Path) -> str:
    html_content = input_html.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html_content, "html.parser")
    # Verwijder niet-zichtbare delen
    for tag in soup(["script", "style", "noscript", "template"]):
        tag.decompose()
    # Pak zichtbare tekst, met nette separators
    text = soup.get_text(separator="\n")
    # Opschonen: lege regels en overbodige spaties verwijderen
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)

def main():
    if len(sys.argv) < 2:
        print("Gebruik: python extract_html_text.py <bron.html> [uitvoer.txt]")
        print("Voorbeeld: python extract_html_text.py pagina.html pagina.txt")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"❌ Bestand niet gevonden: {input_path}")
        sys.exit(2)

    output_path = Path(sys.argv[2]) if len(sys.argv) >= 3 else input_path.with_suffix(".txt")

    clean_text = extract_text(input_path)
    output_path.write_text(clean_text, encoding="utf-8")
    print(f"✅ Klaar! Tekst opgeslagen in: {output_path}")

if __name__ == "__main__":
    main()
