**Geëxporteerd:** 4-1-2026, 15:37:20
**Aantal berichten:** 9

---
**User:**

```
random.sample()
```

```
import random

# Genereer 3 unieke willekeurige getallen tussen 1 en 25 (inclusief)
# De 'range(1, 26)' maakt een reeks van 1 t/m 25.
willekeurige_rijnummers = random.sample(range(1, 26), 3)

print(f"Geselecteerde rijnummers: {willekeurige_rijnummers}")
```

```
import random

# Genereer 3 unieke willekeurige getallen tussen 1 en 25 (inclusief)
# De 'range(1, 26)' maakt een reeks van 1 t/m 25.
willekeurige_rijnummers = random.sample(range(1, 26), 3)

print(f"Geselecteerde rijnummers: {willekeurige_rijnummers}")
```

```
pip install pandas openpyxl
```

```
gegevens.xlsx
```

```
import pandas as pd
import random

# --- Stap 1: Willekeurige getallen ---
willekeurige_indices = random.sample(range(1, 26), 3)
print(f"Geselecteerde rij-indices (1-25): {willekeurige_indices}")

# --- Stap 2 & 3: Excel-gegevens ophalen ---
try:
    # Lees het Excel-bestand. De 'header=0' gaat er meestal van uit dat de eerste rij de kolomnamen bevat.
    # Als je bestand geen kolomnamen heeft, gebruik dan 'header=None' en pas de indices aan.
    excel_data = pd.read_excel('jouw_bestand.xlsx')

| # Pandas gebruikt 0-gebaseerde indexering, dus rij 1 uit je bereik (1-25) is index 0 in Pandas, enz. | # Pandas gebruikt 0-gebaseerde indexering, dus rij 1 uit je bereik (1-25) is index 0 in Pandas, enz. |
| --- | --- |
| # We trekken 1 af van de willekeurige nummers om de 0-gebaseerde indices te krijgen. | # We trekken 1 af van de willekeurige nummers om de 0-gebaseerde indices te krijgen. |
| pandas_indices = [i - 1 for i in willekeurige_indices] | pandas_indices = [i - 1 for i in willekeurige_indices] |

    # Gebruik .iloc[] om rijen op basis van hun integer-locatie op te halen
    geselecteerde_gegevens = excel_data.iloc[pandas_indices]

    print("\n--- Geselecteerde Gegevens ---")
    print(geselecteerde_gegevens)

except FileNotFoundError:
    print(f"\nFout: Het bestand 'jouw_bestand.xlsx' is niet gevonden. Zorg ervoor dat het in dezelfde map staat.")
except IndexError:
    print("\nFout: Een van de gegenereerde getallen is buiten het bereik van de rijen in uw Excel-bestand.")
except Exception as e:
    print(f"\nEr is een onbekende fout opgetreden: {e}")
```

```
import pandas as pd
import random

# --- Stap 1: Willekeurige getallen ---
willekeurige_indices = random.sample(range(1, 26), 3)
print(f"Geselecteerde rij-indices (1-25): {willekeurige_indices}")

# --- Stap 2 & 3: Excel-gegevens ophalen ---
try:
    # Lees het Excel-bestand. De 'header=0' gaat er meestal van uit dat de eerste rij de kolomnamen bevat.
    # Als je bestand geen kolomnamen heeft, gebruik dan 'header=None' en pas de indices aan.
    excel_data = pd.read_excel('jouw_bestand.xlsx')

| # Pandas gebruikt 0-gebaseerde indexering, dus rij 1 uit je bereik (1-25) is index 0 in Pandas, enz. | # Pandas gebruikt 0-gebaseerde indexering, dus rij 1 uit je bereik (1-25) is index 0 in Pandas, enz. |
| --- | --- |
| # We trekken 1 af van de willekeurige nummers om de 0-gebaseerde indices te krijgen. | # We trekken 1 af van de willekeurige nummers om de 0-gebaseerde indices te krijgen. |
| pandas_indices = [i - 1 for i in willekeurige_indices] | pandas_indices = [i - 1 for i in willekeurige_indices] |

    # Gebruik .iloc[] om rijen op basis van hun integer-locatie op te halen
    geselecteerde_gegevens = excel_data.iloc[pandas_indices]

    print("\n--- Geselecteerde Gegevens ---")
    print(geselecteerde_gegevens)

except FileNotFoundError:
    print(f"\nFout: Het bestand 'jouw_bestand.xlsx' is niet gevonden. Zorg ervoor dat het in dezelfde map staat.")
except IndexError:
    print("\nFout: Een van de gegenereerde getallen is buiten het bereik van de rijen in uw Excel-bestand.")
except Exception as e:
    print(f"\nEr is een onbekende fout opgetreden: {e}")
```

```
'jouw_bestand.xlsx'
```

```
range(1, 26)
```

```
pandas_indices = [i - 1 for i in willekeurige_indices]
```

```
random.randint
```

- Genereer drie unieke willekeurige hele getallen tussen 1 en 25 (inclusief).
- Lees het Excel-bestand in.
- Haal de gegevens op die corresponderen met de gegenereerde getallen.

| Key | Value |
| --- | --- |
| Bestandsnaam | Vervang door de werkelijke naam van je Excel-bestand. |
| Indexering | Python/Pandas tellen vanaf 0. Als je gebruikt, ga je uit van de datarijen 1 t/m 25 (na de header). De code zet je 1-gebaseerde nummers om naar 0-gebaseerde indices. |
| Modules | Zorg dat je Pandas en Openpyxl (voor Excel-ondersteuning) hebt geïnstalleerd. |

![image-0](https://www.gstatic.com/images/branding/productlogos/youtube/v9/192px.svg)

![image-1](https://i.ytimg.com/vi/dFO8mKLNyTg/maxresdefault.jpg)

![image-2](https://www.gstatic.com/images/branding/productlogos/youtube/v9/192px.svg)

Ik wil een klein programma maken dat drie verschillende willekeurige hele getallen kiest tussen de 1 en de 25 en daarna uit een excel bestand de corresponderende gegevens haalt

Denkproces tonen
💻 Programma Maken: Willekeurige Excel-Gegevens Ophalen

Je kunt dit programma het beste in Python maken. Je hebt de volgende stappen nodig:

Stap 1: Willekeurige Unieke Getallen Genereren

Je gebruikt de random-module, met name de functie . Deze functie selecteert een gespecificeerd aantal unieke elementen uit een reeks.

Python
Stap 2 & 3: Excel-Gegevens Lezen en Ophalen

De meest gebruikte en krachtige Python-bibliotheek om met Excel-bestanden (en andere data) te werken is Pandas. Je moet deze bibliotheek eerst installeren ().

Je kunt de willekeurige nummers gebruiken als rij-indexen om de corresponderende rijen uit je Excel-bestand te halen.

Stel dat je Excel-bestand heet en de data begint op rij 1 (dus rijnummer 1 in Excel correspondeert met de eerste datarij in Pandas). Als je willekeurige nummers hebt die rij-indexen zijn (waarbij 1 de eerste datarij is), kun je die rijen selecteren.

Python

Belangrijke Aantekeningen:

De volgende video laat zien hoe je willekeurige getallen genereert met Python. Willekeurige getallen genereren in Python - Programmeren 4 ASO - Deze video legt uit hoe je de en andere functies uit de random bibliotheek in Python gebruikt.
Willekeurige getallen genereren in Python - Programmeren 4 ASO - YouTube
martymcvry · 214 weergaven

---

**User:**

```
pip install pandas openpyxl
```

```
pip install streamlit
```

```
selecteer_gegevens.py
```

```
import streamlit as st
import pandas as pd
import random
import os

# --- Configuratie ---
EXCEL_BESTAND = 'jouw_gegevens.xlsx' # VERANDER DIT NAAR DE ECHTE BESTANDSNAAM!
MIN_GETAL = 1
MAX_GETAL = 25 # Selectiebereik is 1 t/m 25
AANTAL_KEUZES = 3

| Key | Value |
| --- | --- |
| # Zorg dat het Excel | bestand in dezelfde map staat als dit script. |
| # Streamlit laat je ook een upload | knop toevoegen, maar dit is het eenvoudigst voor nu. |

def haal_willekeurige_gegevens_op():
    """Genereert 3 unieke willekeurige getallen en haalt de corresponderende Excel-rijen op."""

    st.info(f"Leest het bestand '{EXCEL_BESTAND}'...")

| # 1. Excel-bestand inlezen en controleren | # 1. Excel-bestand inlezen en controleren |
| --- | --- |
| if not os.path.exists(EXCEL_BESTAND): | if not os.path.exists(EXCEL_BESTAND): |
| st.error(f"Fout: Het bestand '{EXCEL_BESTAND}' is niet gevonden.") | st.error(f"Fout: Het bestand '{EXCEL_BESTAND}' is niet gevonden.") |
| st.warning("Zorg ervoor dat het Excel-bestand in dezelfde map staat als dit Python-script.") | st.warning("Zorg ervoor dat het Excel-bestand in dezelfde map staat als dit Python-script.") |
| return None | return None |

| try: | try: |
| --- | --- |
| # Lees het Excel-bestand. Header=0 gaat uit van kolomnamen in de eerste rij. | # Lees het Excel-bestand. Header=0 gaat uit van kolomnamen in de eerste rij. |
| df = pd.read_excel(EXCEL_BESTAND) | df = pd.read_excel(EXCEL_BESTAND) |
| except Exception as e: | except Exception as e: |
| st.error(f"Fout bij het lezen van het Excel-bestand: {e}") | st.error(f"Fout bij het lezen van het Excel-bestand: {e}") |
| return None | return None |

| # Controleer of er voldoende rijen zijn om uit te kiezen | # Controleer of er voldoende rijen zijn om uit te kiezen |
| --- | --- |
| max_rijen = len(df) | max_rijen = len(df) |
| if max_rijen < MAX_GETAL: | if max_rijen < MAX_GETAL: |
| st.warning(f"Opmerking: Het bestand heeft slechts {max_rijen} datarijen, maar we kiezen uit een bereik t/m {MAX_GETAL}.") | st.warning(f"Opmerking: Het bestand heeft slechts {max_rijen} datarijen, maar we kiezen uit een bereik t/m {MAX_GETAL}.") |

    # Zorg dat we niet meer kiezen dan er rijen zijn
    keuze_bereik_boven = min(MAX_GETAL, max_rijen)

| if keuze_bereik_boven < AANTAL_KEUZES: | if keuze_bereik_boven < AANTAL_KEUZES: |
| --- | --- |
| st.error(f"Fout: Kan geen {AANTAL_KEUZES} unieke keuzes maken uit een bereik van slechts {keuze_bereik_boven} rijen.") | st.error(f"Fout: Kan geen {AANTAL_KEUZES} unieke keuzes maken uit een bereik van slechts {keuze_bereik_boven} rijen.") |
| return None | return None |

| # 2. Genereer unieke willekeurige getallen (1-gebaseerd) | # 2. Genereer unieke willekeurige getallen (1-gebaseerd) |
| --- | --- |
| # random.sample selecteert AANTAL_KEUZES (3) unieke nummers uit de reeks (1 t/m 25 of max_rijen) | # random.sample selecteert AANTAL_KEUZES (3) unieke nummers uit de reeks (1 t/m 25 of max_rijen) |
| willekeurige_nummers = random.sample(range(MIN_GETAL, keuze_bereik_boven + 1), AANTAL_KEUZES) | willekeurige_nummers = random.sample(range(MIN_GETAL, keuze_bereik_boven + 1), AANTAL_KEUZES) |

| Key | Value |
| --- | --- |
| # 3. Converteer naar 0 | gebaseerde indices voor Pandas (.iloc) |
| pandas_indices = [i | 1 for i in willekeurige_nummers] |

    # 4. Haal de rijen op
    geselecteerde_gegevens = df.iloc[pandas_indices]

| Key | Value |
| --- | --- |
| # Voeg een kolom toe om de originele 1 | gebaseerde rijnummers te tonen |
| geselecteerde_gegevens['Gekozen Rijnummer (1 | gebaseerd)'] = willekeurige_nummers |

    st.success(f"Drie unieke rijen geselecteerd: {willekeurige_nummers}")

    return geselecteerde_gegevens[['Gekozen Rijnummer (1-gebaseerd)'] + [col for col in geselecteerde_gegevens.columns if col != 'Gekozen Rijnummer (1-gebaseerd)']]

# --- Streamlit App Layout ---

st.set_page_config(page_title="Willekeurige Gegevens Selectie", layout="centered")

st.title("🎲 Random Data Selector")
st.markdown(f"Klik op de knop om **{AANTAL_KEUZES}** verschillende willekeurige rijen te kiezen uit de eerste **{MAX_GETAL}** datarijen van het Excel-bestand **`{EXCEL_BESTAND}`**.")

# Maak een knop aan.
if st.button("Kies 3 Willekeurige Gegevensrijen"):
    # Als de knop wordt ingedrukt, voer de functie uit
    with st.spinner('Bezig met kiezen en laden...'):
        resultaat_df = haal_willekeurige_gegevens_op()

| # Presenteer de gegevens als er een resultaat is | # Presenteer de gegevens als er een resultaat is |
| --- | --- |
| if resultaat_df is not None: | if resultaat_df is not None: |
| st.header("✨ Geselecteerde Gegevens") | st.header("✨ Geselecteerde Gegevens") |

        # Gebruik st.dataframe of st.table voor mooie presentatie
        st.dataframe(resultaat_df, use_container_width=True)

| # Optioneel: Toon de gegevens als Markdown/tekst | # Optioneel: Toon de gegevens als Markdown/tekst |
| --- | --- |
| # st.markdown("### Ruwe Data:") | # st.markdown("### Ruwe Data:") |
| # st.code(resultaat_df.to_string()) | # st.code(resultaat_df.to_string()) |

st.caption("Zorg ervoor dat het Excel-bestand gesloten is voordat u deze app gebruikt.")
```

```
import streamlit as st
import pandas as pd
import random
import os

# --- Configuratie ---
EXCEL_BESTAND = 'jouw_gegevens.xlsx' # VERANDER DIT NAAR DE ECHTE BESTANDSNAAM!
MIN_GETAL = 1
MAX_GETAL = 25 # Selectiebereik is 1 t/m 25
AANTAL_KEUZES = 3

| Key | Value |
| --- | --- |
| # Zorg dat het Excel | bestand in dezelfde map staat als dit script. |
| # Streamlit laat je ook een upload | knop toevoegen, maar dit is het eenvoudigst voor nu. |

def haal_willekeurige_gegevens_op():
    """Genereert 3 unieke willekeurige getallen en haalt de corresponderende Excel-rijen op."""

    st.info(f"Leest het bestand '{EXCEL_BESTAND}'...")

| # 1. Excel-bestand inlezen en controleren | # 1. Excel-bestand inlezen en controleren |
| --- | --- |
| if not os.path.exists(EXCEL_BESTAND): | if not os.path.exists(EXCEL_BESTAND): |
| st.error(f"Fout: Het bestand '{EXCEL_BESTAND}' is niet gevonden.") | st.error(f"Fout: Het bestand '{EXCEL_BESTAND}' is niet gevonden.") |
| st.warning("Zorg ervoor dat het Excel-bestand in dezelfde map staat als dit Python-script.") | st.warning("Zorg ervoor dat het Excel-bestand in dezelfde map staat als dit Python-script.") |
| return None | return None |

| try: | try: |
| --- | --- |
| # Lees het Excel-bestand. Header=0 gaat uit van kolomnamen in de eerste rij. | # Lees het Excel-bestand. Header=0 gaat uit van kolomnamen in de eerste rij. |
| df = pd.read_excel(EXCEL_BESTAND) | df = pd.read_excel(EXCEL_BESTAND) |
| except Exception as e: | except Exception as e: |
| st.error(f"Fout bij het lezen van het Excel-bestand: {e}") | st.error(f"Fout bij het lezen van het Excel-bestand: {e}") |
| return None | return None |

| # Controleer of er voldoende rijen zijn om uit te kiezen | # Controleer of er voldoende rijen zijn om uit te kiezen |
| --- | --- |
| max_rijen = len(df) | max_rijen = len(df) |
| if max_rijen < MAX_GETAL: | if max_rijen < MAX_GETAL: |
| st.warning(f"Opmerking: Het bestand heeft slechts {max_rijen} datarijen, maar we kiezen uit een bereik t/m {MAX_GETAL}.") | st.warning(f"Opmerking: Het bestand heeft slechts {max_rijen} datarijen, maar we kiezen uit een bereik t/m {MAX_GETAL}.") |

    # Zorg dat we niet meer kiezen dan er rijen zijn
    keuze_bereik_boven = min(MAX_GETAL, max_rijen)

| if keuze_bereik_boven < AANTAL_KEUZES: | if keuze_bereik_boven < AANTAL_KEUZES: |
| --- | --- |
| st.error(f"Fout: Kan geen {AANTAL_KEUZES} unieke keuzes maken uit een bereik van slechts {keuze_bereik_boven} rijen.") | st.error(f"Fout: Kan geen {AANTAL_KEUZES} unieke keuzes maken uit een bereik van slechts {keuze_bereik_boven} rijen.") |
| return None | return None |

| # 2. Genereer unieke willekeurige getallen (1-gebaseerd) | # 2. Genereer unieke willekeurige getallen (1-gebaseerd) |
| --- | --- |
| # random.sample selecteert AANTAL_KEUZES (3) unieke nummers uit de reeks (1 t/m 25 of max_rijen) | # random.sample selecteert AANTAL_KEUZES (3) unieke nummers uit de reeks (1 t/m 25 of max_rijen) |
| willekeurige_nummers = random.sample(range(MIN_GETAL, keuze_bereik_boven + 1), AANTAL_KEUZES) | willekeurige_nummers = random.sample(range(MIN_GETAL, keuze_bereik_boven + 1), AANTAL_KEUZES) |

| Key | Value |
| --- | --- |
| # 3. Converteer naar 0 | gebaseerde indices voor Pandas (.iloc) |
| pandas_indices = [i | 1 for i in willekeurige_nummers] |

    # 4. Haal de rijen op
    geselecteerde_gegevens = df.iloc[pandas_indices]

| Key | Value |
| --- | --- |
| # Voeg een kolom toe om de originele 1 | gebaseerde rijnummers te tonen |
| geselecteerde_gegevens['Gekozen Rijnummer (1 | gebaseerd)'] = willekeurige_nummers |

    st.success(f"Drie unieke rijen geselecteerd: {willekeurige_nummers}")

    return geselecteerde_gegevens[['Gekozen Rijnummer (1-gebaseerd)'] + [col for col in geselecteerde_gegevens.columns if col != 'Gekozen Rijnummer (1-gebaseerd)']]

# --- Streamlit App Layout ---

st.set_page_config(page_title="Willekeurige Gegevens Selectie", layout="centered")

st.title("🎲 Random Data Selector")
st.markdown(f"Klik op de knop om **{AANTAL_KEUZES}** verschillende willekeurige rijen te kiezen uit de eerste **{MAX_GETAL}** datarijen van het Excel-bestand **`{EXCEL_BESTAND}`**.")

# Maak een knop aan.
if st.button("Kies 3 Willekeurige Gegevensrijen"):
    # Als de knop wordt ingedrukt, voer de functie uit
    with st.spinner('Bezig met kiezen en laden...'):
        resultaat_df = haal_willekeurige_gegevens_op()

| # Presenteer de gegevens als er een resultaat is | # Presenteer de gegevens als er een resultaat is |
| --- | --- |
| if resultaat_df is not None: | if resultaat_df is not None: |
| st.header("✨ Geselecteerde Gegevens") | st.header("✨ Geselecteerde Gegevens") |

        # Gebruik st.dataframe of st.table voor mooie presentatie
        st.dataframe(resultaat_df, use_container_width=True)

| # Optioneel: Toon de gegevens als Markdown/tekst | # Optioneel: Toon de gegevens als Markdown/tekst |
| --- | --- |
| # st.markdown("### Ruwe Data:") | # st.markdown("### Ruwe Data:") |
| # st.code(resultaat_df.to_string()) | # st.code(resultaat_df.to_string()) |

st.caption("Zorg ervoor dat het Excel-bestand gesloten is voordat u deze app gebruikt.")
```

```
jouw_gegevens.xlsx
```

```
selecteer_gegevens.py
```

```
streamlit run selecteer_gegevens.py
```

```
streamlit run selecteer_gegevens.py
```

```
streamlit run
```

- Python (geïnstalleerd).
- Pandas (om Excel te lezen):
- Streamlit (om de GUI te maken):

- Zorg ervoor dat je Excel-bestand (bijvoorbeeld ) in dezelfde map staat als het Python-script ().
- Verifieer dat de kolomnamen in de eerste rij staan.
- Installeer de vereiste bibliotheken (zie hierboven).

| Key | Value |
| --- | --- |
| Lokaal Delen (Eenvoudig) | Zorg dat al je collega's Python en de vereiste modules (pandas, streamlit, openpyxl) installeren. Ze hoeven dan alleen het script en het Excel-bestand te kopiëren en het -commando uit te voeren. |
| Netwerk Delen (Geavanceerd) | Als jullie in hetzelfde netwerk zitten, toont Streamlit een "Network URL" nadat je het script start. Je collega's kunnen deze URL in hun browser intypen om de app te gebruiken terwijl deze op jouw computer draait. |
| Verpakken (Meest gebruiksvriendelijk) | Je kunt het script omzetten naar een uitvoerbaar bestand (.exe) met tools zoals PyInstaller. Dit is de meest gebruiksvriendelijke manier, omdat je collega's dan geen Python hoeven te installeren, maar dit is wel de meest complexe optie om op te zetten. |

Ik wil een klein programma maken dat mijn collegas ook kunnen gebruiken waarmee we op een button klikken en er drie verschillende willekeurige hele getallen gekozen worden tussen de 1 en de 25 en daarna uit een excel bestand de corresponderende gegevens haalt en mooi presenteert.

🛠️ Gebruiksvriendelijk Programma Maken met Knoppen

Om een programma te maken dat je collega's gemakkelijk kunnen gebruiken (dus met een knop en een mooie presentatie), is de beste aanpak om een Python-script te combineren met een eenvoudige grafische gebruikersinterface (GUI).

De meest gangbare en eenvoudige bibliotheek hiervoor in Python is Tkinter (standaard in Python) of Streamlit (voor een webgebaseerde, maar heel simpele, app). We kiezen hier voor de Streamlit-aanpak, omdat die het presenteren van de gegevens veel mooier en eenvoudiger maakt dan Tkinter.

Vereiste Tools
💻 Het Python Programma (met Streamlit)

Sla de onderstaande code op als een bestand genaamd .

Python
🚀 Programma Uitvoeren en Delen
1. Voorbereiding
2. Starten

Open de Terminal of Command Prompt, navigeer naar de map waarin je het bestand hebt opgeslagen en voer dit commando uit:

Bash

Er opent nu automatisch een nieuw tabblad in je webbrowser met de applicatie.

3. Delen met Collega's

Kan ik je helpen met het installeren van de modules of heb je een voorbeeld nodig van hoe je Excel-bestand eruit moet zien?

---

**User:**

| Argument | Betekenis |
| --- | --- |
| --onefile | Bundelt alles in één enkel .exe bestand (gemakkelijk te delen). |
| --windowed | Zorgt ervoor dat er geen zwarte consolevenster (Terminal) opent. Dit is essentieel voor een mooie GUI-app. |

```
pip install pandas openpyxl streamlit
pip install pyinstaller
```

```
pip install pandas openpyxl streamlit
pip install pyinstaller
```

```
selecteer_gegevens.py
```

```
selecteer_gegevens.py
```

```
jouw_gegevens.xlsx
```

```
selecteer_gegevens.py
```

```
cd C:\gebruikers\jouwnaam\Documenten\RandomSelector
```

```
cd C:\gebruikers\jouwnaam\Documenten\RandomSelector
```

```
pyinstaller --onefile --windowed selecteer_gegevens.py
```

```
pyinstaller --onefile --windowed selecteer_gegevens.py
```

```
pyinstaller --onefile --windowed --add-data "jouw_gegevens.xlsx:." selecteer_gegevens.py
```

```
pyinstaller --onefile --windowed --add-data "jouw_gegevens.xlsx:." selecteer_gegevens.py
```

```
jouw_gegevens.xlsx
```

```
--add-data "jouw_gegevens.xlsx;."
```

```
--add-data "jouw_gegevens.xlsx:."
```

```
selecteer_gegevens.exe
```

```
.../RandomSelector/dist/selecteer_gegevens.exe
```

```
selecteer_gegevens.exe
```

- Open de Command Prompt / Terminal.
- Voer de installatiecommando's uit:
Je hebt Pandas (voor Excel-verwerking), Openpyxl (een noodzakelijke afhankelijkheid van Pandas voor moderne Excel-bestanden), Streamlit (voor de gebruikersinterface) en PyInstaller (om de .exe te maken) nodig.

| Key | Value |
| --- | --- |
| Navigeer naar je map | Ga in de Command Prompt naar de map waarin je hebt opgeslagen. Gebruik hiervoor het cd (change directory) commando. |
| Voorbeeld | Bash |
| Genereer de .exe | Voer het volgende commando in:BashExporteren naar Spreadsheets |

- Naam:
- Locatie:

- Jij en je collega's dubbelklikken op het  bestand in de dist-map.
- Een venster opent kort, en dan start de Streamlit-app automatisch in hun standaard webbrowser.
- Ze kunnen nu op de knop klikken om de willekeurige selectie uit te voeren.

Help me met installeren van modules en het creeeren van een .exe

Dit is een uitstekend plan! Door het programma te verpakken als een .exe, maak je het echt gebruiksvriendelijk voor je collega's, omdat ze dan niets hoeven te installeren.

Hier is een stappenplan voor zowel de installatie van de modules als het creëren van het .exe bestand.

1. Modules Installeren 📦

Voordat je de .exe kunt maken, moet je de benodigde Python-modules installeren. Dit doe je via de Command Prompt (Windows) of Terminal (macOS/Linux).

Bash

Opmerking: Als het commando pip niet werkt, probeer dan pip3 te gebruiken.

2. Het .exe Bestand Maken met PyInstaller

PyInstaller neemt je Python-script () en bundelt het met alle noodzakelijke afhankelijkheden (inclusief Python zelf en alle modules) in één map, inclusief een uitvoerbaar (.exe) bestand.

Stap 2.1: Het Script Opslaan

Zorg ervoor dat het Python-script (dat we eerder hebben gemaakt) is opgeslagen als . Zorg er ook voor dat je Excel-bestand (of hoe je het ook hebt genoemd) in dezelfde map staat.

| Key | Value |
| --- | --- |
| Stap 2.2 | PyInstaller Commando Uitvoeren |
| Stap 2.3 | Het dist-bestand aanpassen (Zeer Belangrijk!) |

Omdat je programma een Streamlit-app is die in een browser wordt uitgevoerd, werkt de standaard --onefile niet goed voor iedereen. De meest stabiele manier is om het programma het Excel-bestand in de bundel te laten zien.

Herhaal stap 2.2 met de volgende commando, wat ervoor zorgt dat het .exe-bestand ook je Excel-bestand kent:

Bash

Let op: Je moet vervangen door de werkelijke naam van je Excel-bestand.

Voor Windows: Gebruik een puntkomma (: werkt vaak ook, maar ; is de officiële Windows-syntax):

Voor Linux/macOS: Gebruik een dubbele punt:

2.4: Het Resultaat Vinden

Na het uitvoeren van het PyInstaller-commando zijn er twee nieuwe mappen in je projectmap gemaakt: build en dist.

Het .exe bestand dat je nodig hebt staat in de map dist.

Dit bestand is klaar om gedeeld te worden.

3. Het Programma Gebruiken

---

**User:**

```
config.toml
```

```
config.toml
```

```
config.toml
```

```
[theme]
# Primaire kleur voor knoppen en links
primaryColor="#7336b2"

# Achtergrondkleur van de app
backgroundColor="#0e1117"

# Achtergrondkleur voor sidebars en pop-ups
secondaryBackgroundColor="#262730"

# Kleur van tekst
textColor="#fafafa"

# Lettertype
font="sans serif"
```

```
[theme]
# Primaire kleur voor knoppen en links
primaryColor="#7336b2"

# Achtergrondkleur van de app
backgroundColor="#0e1117"

# Achtergrondkleur voor sidebars en pop-ups
secondaryBackgroundColor="#262730"

# Kleur van tekst
textColor="#fafafa"

# Lettertype
font="sans serif"
```

```
backgroundColor
```

```
secondaryBackgroundColor
```

```
st.set_page_config()
```

```
selecteer_gegevens.py
```

```
st.set_page_config(
    page_title="Willekeurige Gegevens Selectie",
    layout="wide", # Dit zorgt ervoor dat de content de volledige breedte van de browser gebruikt
    initial_sidebar_state="auto"
)
```

```
st.set_page_config(
    page_title="Willekeurige Gegevens Selectie",
    layout="wide", # Dit zorgt ervoor dat de content de volledige breedte van de browser gebruikt
    initial_sidebar_state="auto"
)
```

```
layout="wide"
```

```
st.markdown()
```

```
st.title("🎲 Random Data Selector")
st.markdown("Klik op de knop om **3** rijen te kiezen uit het Excel-bestand.")
```

```
st.title("🎲 Random Data Selector")
st.markdown("Klik op de knop om **3** rijen te kiezen uit het Excel-bestand.")
```

```
st.success("Drie unieke rijen geselecteerd!") # Groene achtergrond
st.warning("Let op: Het Excel-bestand wordt gelezen.") # Gele achtergrond
```

```
st.success("Drie unieke rijen geselecteerd!") # Groene achtergrond
st.warning("Let op: Het Excel-bestand wordt gelezen.") # Gele achtergrond
```

```
st.set_page_config()
```

```
# Aangepaste CSS injecteren voor styling
st.markdown(
    """
    <style>
    /* Pas de stijl van de hoofdheader aan */
    h1 {
        color: #7336b2; /* Gebruik je primaire kleur */
        text-align: center; /* Centreer de titel */
        font-size: 2.5em;
    }

| display: block |  |
| --- | --- |
| margin: 0 auto |  |
| padding: 10px 30px |  |
| font-size: 1.2em |  |
| border-radius: 8px |  |

    /* Stijl van de tabel header */
    .dataframe th {
        background-color: #262730; /* Donkerdere achtergrond */
        color: white;
    }
    </style>
    """,
    unsafe_allow_html=True
)
```

```
# Aangepaste CSS injecteren voor styling
st.markdown(
    """
    <style>
    /* Pas de stijl van de hoofdheader aan */
    h1 {
        color: #7336b2; /* Gebruik je primaire kleur */
        text-align: center; /* Centreer de titel */
        font-size: 2.5em;
    }

| display: block |  |
| --- | --- |
| margin: 0 auto |  |
| padding: 10px 30px |  |
| font-size: 1.2em |  |
| border-radius: 8px |  |

    /* Stijl van de tabel header */
    .dataframe th {
        background-color: #262730; /* Donkerdere achtergrond */
        color: white;
    }
    </style>
    """,
    unsafe_allow_html=True
)
```

- Streamlit's Ingebouwde Opties (Thema, Layout, Widgets).
- Aangepaste CSS (voor de fijnere details).

- Maak een nieuwe map aan in je projectmap genaamd: .streamlit
- Maak daarbinnen een nieuw tekstbestand aan genaamd:

| Key | Value |
| --- | --- |
| Titel & Tekst | Gebruik emoji's in de st.title() en :Python |
| Statusberichten | Pas de kleur van de statusberichten aan:Python |

Kan ik het programma ook qua uiterlijk aanpassen? En zo ja, hoe?

Jazeker, dat kan zeker! 🎨 Aangezien je het programma bouwt met Streamlit, heb je al een heel moderne basis. Je kunt het uiterlijk op verschillende manieren aanpassen:

1. Streamlit Thema en Layout Aanpassen

Dit zijn de snelste en meest gangbare manieren om het uiterlijk te veranderen.

A. Kleurenthema Veranderen

Je kunt het thema van de hele applicatie aanpassen met behulp van de file, die in een map genaamd .streamlit in je projectmap moet staan.

Voeg de volgende code toe aan om een donker thema te gebruiken met aangepaste kleuren:

Ini, TOML

Tip: Als je het donkere thema niet wilt, haal dan de en weg.

B. Pagina Layout Aanpassen

Je kunt de breedte van de content aanpassen met . Standaard is Streamlit vrij smal.

Voeg dit toe boven aan je Python-script ():

Python

Door te gebruiken, krijgt de tabel met de geselecteerde gegevens veel meer ruimte.

C. Afbeeldingen en Emoji's Toevoegen

Je kunt emoji's, afbeeldingen of icoontjes gebruiken om de interface op te fleuren.

2. Aangepaste CSS Toevoegen (Geavanceerd)

Voor zeer specifieke aanpassingen, zoals het centreren van de knop of het aanpassen van de lettergrootte van de headers, kun je CSS (Cascading Style Sheets) injecteren.

Voeg dit blok toe aan je Python-script (bij voorkeur direct na ):

Python

Door deze stappen te volgen, kun je een veel professionelere en op maat gemaakte look creëren voor je collega's!

---

**User:**

| Module | Functie | Installatie Commando |
| --- | --- | --- |
| Pandas | De basis voor het lezen, bewerken en analyseren van je Excel-gegevens. | pip install pandas |
| openpyxl | Een module die Pandas nodig heeft om moderne .xlsx bestanden te kunnen lezen. | (Wordt vaak automatisch meegeïnstalleerd met Pandas) |
| Streamlit | De bibliotheek voor het maken van de gebruiksvriendelijke interface met de knop en de mooie presentatie. | pip install streamlit |
| PyInstaller | Het hulpmiddel dat het Python-script, alle modules en Python zelf bundelt tot één uitvoerbaar .exe-bestand. | pip install pyinstaller |

```
pip install pandas openpyxl streamlit
```

```
pip install pandas openpyxl streamlit
```

```
pip install pyinstaller
```

```
pip install pyinstaller
```

- Ga naar de officiële Python website: python.org/downloads
- Download de nieuwste stabiele versie voor jouw besturingssysteem (meestal Windows of macOS).
- Heel Belangrijk bij de installatie: Zorg ervoor dat je het vakje "Add Python to PATH" of "Add python.exe to PATH" aanvinkt tijdens de eerste stap van de installatie. Dit zorgt ervoor dat je Python en pip kunt gebruiken in de Command Prompt/Terminal.

| Key | Value |
| --- | --- |
| Installeer de app | bouw en data-modules:Bash |
| Installeer de tool om de .exe te maken | Bash |

Welke programmas moet ik downloaden om bovenstaande te kunnen dien?

Om het programma te kunnen maken, inpakken als een .exe, en aanpassen qua uiterlijk, heb je in principe maar één ding nodig: Python.

Binnen Python installeer je vervolgens de benodigde modules (bibliotheken).

Hier is een overzicht van wat je moet hebben en hoe je het installeert:

1. Python 🐍 (Het Hoofdprogramma)

Wat het is: Dit is de programmeertaal die je gebruikt.

Installeren:

2. Python Modules 📦 (De Extra Functionaliteit)

De modules zijn de 'gereedschappen' die je aan Python toevoegt om specifieke taken uit te voeren. Je installeert deze met het programma pip (dat automatisch met Python wordt meegeleverd) in de Command Prompt (CMD) of Terminal.

Exporteren naar Spreadsheets
Installatiestappen (Samengevat)

Nadat je Python hebt geïnstalleerd, open je de Command Prompt en voer je deze commando's in:

Als deze stappen succesvol zijn, heb je alles wat je nodig hebt om het programma te schrijven, de look aan te passen en te verpakken voor je collega's!

---

**User:**

```
pd.read_excel()
```

```
pd.read_html()
```

```
web_selector.py
```

```
import streamlit as st
import pandas as pd
import random

# --- Configuratie ---
WEB_URL = 'https://nl.wikipedia.org/wiki/Lijst_van_gemeenten_in_Zuid-Holland' # VERVANG DIT DOOR DE URL VAN JE DATA!
MIN_GETAL = 1
MAX_GETAL = 25 # Selectiebereik is 1 t/m 25
AANTAL_KEUZES = 3

# --- Functie om data van de website te halen ---
def haal_willekeurige_gegevens_op_van_web():
    """Haalt data van een webpagina (HTML-tabel), genereert 3 unieke willekeurige getallen
    en haalt de corresponderende rijen op."""

    st.info(f"Leest data van: {WEB_URL}...")

| try: | try: |
| --- | --- |
| # 1. Lees alle HTML-tabellen op de pagina | # 1. Lees alle HTML-tabellen op de pagina |
| # read_html retourneert een LIJST van DataFrames, één voor elke tabel op de pagina. | # read_html retourneert een LIJST van DataFrames, één voor elke tabel op de pagina. |
| lijst_van_df = pd.read_html(WEB_URL) | lijst_van_df = pd.read_html(WEB_URL) |

| # Voor dit voorbeeld (Wikipedia) nemen we de EERSTE (index 0) of de MEEST RELEVANTE tabel. | # Voor dit voorbeeld (Wikipedia) nemen we de EERSTE (index 0) of de MEEST RELEVANTE tabel. |
| --- | --- |
| # Mogelijk moet je de index aanpassen als de data in een andere tabel staat. | # Mogelijk moet je de index aanpassen als de data in een andere tabel staat. |
| df = lijst_van_df[0] | df = lijst_van_df[0] |

        st.success(f"Tabel succesvol geladen met {len(df)} rijen en {len(df.columns)} kolommen.")

| except ValueError: | except ValueError: |
| --- | --- |
| st.error("Fout: Kon geen HTML-tabel vinden op deze URL. Zorg dat de data in tabelvorm op de pagina staat.") | st.error("Fout: Kon geen HTML-tabel vinden op deze URL. Zorg dat de data in tabelvorm op de pagina staat.") |
| return None | return None |
| except Exception as e: | except Exception as e: |
| st.error(f"Fout bij het laden van de webpagina: {e}") | st.error(f"Fout bij het laden van de webpagina: {e}") |
| return None | return None |

| # --- De Random Selectie blijft hetzelfde --- | # --- De Random Selectie blijft hetzelfde --- |
| --- | --- |
| max_rijen = len(df) | max_rijen = len(df) |
| keuze_bereik_boven = min(MAX_GETAL, max_rijen) | keuze_bereik_boven = min(MAX_GETAL, max_rijen) |

| if keuze_bereik_boven < AANTAL_KEUZES: | if keuze_bereik_boven < AANTAL_KEUZES: |
| --- | --- |
| st.error(f"Fout: Kan geen {AANTAL_KEUZES} unieke keuzes maken uit een bereik van slechts {keuze_bereik_boven} rijen.") | st.error(f"Fout: Kan geen {AANTAL_KEUZES} unieke keuzes maken uit een bereik van slechts {keuze_bereik_boven} rijen.") |
| return None | return None |

    # 2. Genereer unieke willekeurige getallen (1-gebaseerd)
    willekeurige_nummers = random.sample(range(MIN_GETAL, keuze_bereik_boven + 1), AANTAL_KEUZES)

| Key | Value |
| --- | --- |
| # 3. Converteer naar 0 | gebaseerde indices voor Pandas (.iloc) |
| pandas_indices = [i | 1 for i in willekeurige_nummers] |

    # 4. Haal de rijen op
    geselecteerde_gegevens = df.iloc[pandas_indices]

| Key | Value |
| --- | --- |
| # Voeg een kolom toe om de originele 1 | gebaseerde rijnummers te tonen |
| geselecteerde_gegevens['Gekozen Rijnummer (1 | gebaseerd)'] = willekeurige_nummers |

    st.success(f"Drie unieke rijen geselecteerd: {willekeurige_nummers}")

    # Herorden de kolommen
    return geselecteerde_gegevens[['Gekozen Rijnummer (1-gebaseerd)'] + [col for col in geselecteerde_gegevens.columns if col != 'Gekozen Rijnummer (1-gebaseerd)']]

# --- Streamlit App Layout ---

st.set_page_config(page_title="Willekeurige Web Data Selectie", layout="wide")

st.title("🌐 Random Web Data Selector")
st.markdown(f"Klik op de knop om **{AANTAL_KEUZES}** verschillende willekeurige rijen te kiezen uit de eerste **{MAX_GETAL}** datarijen van de website.")

if st.button("Kies 3 Willekeurige Gegevensrijen van de Website"):
    with st.spinner('Bezig met laden en kiezen...'):
        resultaat_df = haal_willekeurige_gegevens_op_van_web()

| if resultaat_df is not None: | if resultaat_df is not None: |
| --- | --- |
| st.header("✨ Geselecteerde Gegevens") | st.header("✨ Geselecteerde Gegevens") |
| st.dataframe(resultaat_df, use_container_width=True) | st.dataframe(resultaat_df, use_container_width=True) |

st.caption(f"De app probeert data te halen van: **{WEB_URL}**")
```

```
import streamlit as st
import pandas as pd
import random

# --- Configuratie ---
WEB_URL = 'https://nl.wikipedia.org/wiki/Lijst_van_gemeenten_in_Zuid-Holland' # VERVANG DIT DOOR DE URL VAN JE DATA!
MIN_GETAL = 1
MAX_GETAL = 25 # Selectiebereik is 1 t/m 25
AANTAL_KEUZES = 3

# --- Functie om data van de website te halen ---
def haal_willekeurige_gegevens_op_van_web():
    """Haalt data van een webpagina (HTML-tabel), genereert 3 unieke willekeurige getallen
    en haalt de corresponderende rijen op."""

    st.info(f"Leest data van: {WEB_URL}...")

| try: | try: |
| --- | --- |
| # 1. Lees alle HTML-tabellen op de pagina | # 1. Lees alle HTML-tabellen op de pagina |
| # read_html retourneert een LIJST van DataFrames, één voor elke tabel op de pagina. | # read_html retourneert een LIJST van DataFrames, één voor elke tabel op de pagina. |
| lijst_van_df = pd.read_html(WEB_URL) | lijst_van_df = pd.read_html(WEB_URL) |

| # Voor dit voorbeeld (Wikipedia) nemen we de EERSTE (index 0) of de MEEST RELEVANTE tabel. | # Voor dit voorbeeld (Wikipedia) nemen we de EERSTE (index 0) of de MEEST RELEVANTE tabel. |
| --- | --- |
| # Mogelijk moet je de index aanpassen als de data in een andere tabel staat. | # Mogelijk moet je de index aanpassen als de data in een andere tabel staat. |
| df = lijst_van_df[0] | df = lijst_van_df[0] |

        st.success(f"Tabel succesvol geladen met {len(df)} rijen en {len(df.columns)} kolommen.")

| except ValueError: | except ValueError: |
| --- | --- |
| st.error("Fout: Kon geen HTML-tabel vinden op deze URL. Zorg dat de data in tabelvorm op de pagina staat.") | st.error("Fout: Kon geen HTML-tabel vinden op deze URL. Zorg dat de data in tabelvorm op de pagina staat.") |
| return None | return None |
| except Exception as e: | except Exception as e: |
| st.error(f"Fout bij het laden van de webpagina: {e}") | st.error(f"Fout bij het laden van de webpagina: {e}") |
| return None | return None |

| # --- De Random Selectie blijft hetzelfde --- | # --- De Random Selectie blijft hetzelfde --- |
| --- | --- |
| max_rijen = len(df) | max_rijen = len(df) |
| keuze_bereik_boven = min(MAX_GETAL, max_rijen) | keuze_bereik_boven = min(MAX_GETAL, max_rijen) |

| if keuze_bereik_boven < AANTAL_KEUZES: | if keuze_bereik_boven < AANTAL_KEUZES: |
| --- | --- |
| st.error(f"Fout: Kan geen {AANTAL_KEUZES} unieke keuzes maken uit een bereik van slechts {keuze_bereik_boven} rijen.") | st.error(f"Fout: Kan geen {AANTAL_KEUZES} unieke keuzes maken uit een bereik van slechts {keuze_bereik_boven} rijen.") |
| return None | return None |

    # 2. Genereer unieke willekeurige getallen (1-gebaseerd)
    willekeurige_nummers = random.sample(range(MIN_GETAL, keuze_bereik_boven + 1), AANTAL_KEUZES)

| Key | Value |
| --- | --- |
| # 3. Converteer naar 0 | gebaseerde indices voor Pandas (.iloc) |
| pandas_indices = [i | 1 for i in willekeurige_nummers] |

    # 4. Haal de rijen op
    geselecteerde_gegevens = df.iloc[pandas_indices]

| Key | Value |
| --- | --- |
| # Voeg een kolom toe om de originele 1 | gebaseerde rijnummers te tonen |
| geselecteerde_gegevens['Gekozen Rijnummer (1 | gebaseerd)'] = willekeurige_nummers |

    st.success(f"Drie unieke rijen geselecteerd: {willekeurige_nummers}")

    # Herorden de kolommen
    return geselecteerde_gegevens[['Gekozen Rijnummer (1-gebaseerd)'] + [col for col in geselecteerde_gegevens.columns if col != 'Gekozen Rijnummer (1-gebaseerd)']]

# --- Streamlit App Layout ---

st.set_page_config(page_title="Willekeurige Web Data Selectie", layout="wide")

st.title("🌐 Random Web Data Selector")
st.markdown(f"Klik op de knop om **{AANTAL_KEUZES}** verschillende willekeurige rijen te kiezen uit de eerste **{MAX_GETAL}** datarijen van de website.")

if st.button("Kies 3 Willekeurige Gegevensrijen van de Website"):
    with st.spinner('Bezig met laden en kiezen...'):
        resultaat_df = haal_willekeurige_gegevens_op_van_web()

| if resultaat_df is not None: | if resultaat_df is not None: |
| --- | --- |
| st.header("✨ Geselecteerde Gegevens") | st.header("✨ Geselecteerde Gegevens") |
| st.dataframe(resultaat_df, use_container_width=True) | st.dataframe(resultaat_df, use_container_width=True) |

st.caption(f"De app probeert data te halen van: **{WEB_URL}**")
```

```
pd.read_html(URL)
```

```
df = lijst_van_df[0]
```

```
df = lijst_van_df[1]
```

```
df = lijst_van_df[2]
```

```
streamlit run web_selector.py
```

```
streamlit run web_selector.py
```

| Key | Value |
| --- | --- |
| WEB_URL aanpassen | Zorg ervoor dat je de variabele WEB_URL in het script wijzigt naar de exacte link van de webpagina met de data. |
| Tabel Index | leest ALLE tabellen op die pagina in een lijst. De lijn selecteert de eerste tabel (index 0). Als de data die je wilt gebruiken in de tweede, derde, of andere tabel staat, moet je dit aanpassen naar , , enzovoort. |

- Zorg dat de modules pandas en streamlit zijn geïnstalleerd.
- Start het programma in de Terminal/Command Prompt met:Bash

Haal de data van een website in plaats van een excelbestand

Dat is een prima aanpassing! Je kunt de data van een website inlezen met Pandas in plaats van een Excel-bestand. Dit werkt vooral goed als de data op de website in een gestructureerde vorm staat, zoals een HTML-tabel.

Hieronder vindt je een aangepast Python-script dat data rechtstreeks van een URL haalt, de willekeurige selectie uitvoert en deze presenteert met Streamlit.

💻 Aangepast Python Programma (Data van Website)

In dit script vervangen we de stap door de functie.

Sla de onderstaande code op als .

Python
Belangrijke Overwegingen
1. De Juiste URL en Tabel (Index) 🎯

De grootste uitdaging is het bepalen van de juiste URL en de juiste tabelindex:

2. Uitvoeren

De stappen om dit programma uit te voeren blijven hetzelfde:

---

**User:**

```
pd.read_html
```

```
[
    {"Rijnummer": 1, "Plaats": "Utrecht", "Waarde": 150},
    {"Rijnummer": 2, "Plaats": "Amsterdam", "Waarde": 220},
    // ... Voeg hier nog 23 objecten toe tot Rijnummer 25
    {"Rijnummer": 25, "Plaats": "Rotterdam", "Waarde": 180}
]
```

```
[
    {"Rijnummer": 1, "Plaats": "Utrecht", "Waarde": 150},
    {"Rijnummer": 2, "Plaats": "Amsterdam", "Waarde": 220},
    // ... Voeg hier nog 23 objecten toe tot Rijnummer 25
    {"Rijnummer": 25, "Plaats": "Rotterdam", "Waarde": 180}
]
```

```
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random Data Selector (JS)</title>
    <link rel="stylesheet" href="styles.css"> </head>
<body>

| <header> | <header> |
| --- | --- |
| <h1>🎲 Random Data Selector</h1> | <h1>🎲 Random Data Selector</h1> |
| <p>Klik op de knop om 3 willekeurige rijen te selecteren uit het databestand.</p> | <p>Klik op de knop om 3 willekeurige rijen te selecteren uit het databestand.</p> |
| </header> | </header> |

    <main>
        <button id="selectButton">Kies 3 Willekeurige Gegevensrijen</button>

| <section id="resultaatContainer"> | <section id="resultaatContainer"> |
| --- | --- |
| <h2>Geselecteerde Gegevens</h2> | <h2>Geselecteerde Gegevens</h2> |
| </section> | </section> |
| </main> | </main> |

    <script src="script.js"></script> </body>
</html>
```

```
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random Data Selector (JS)</title>
    <link rel="stylesheet" href="styles.css"> </head>
<body>

| <header> | <header> |
| --- | --- |
| <h1>🎲 Random Data Selector</h1> | <h1>🎲 Random Data Selector</h1> |
| <p>Klik op de knop om 3 willekeurige rijen te selecteren uit het databestand.</p> | <p>Klik op de knop om 3 willekeurige rijen te selecteren uit het databestand.</p> |
| </header> | </header> |

    <main>
        <button id="selectButton">Kies 3 Willekeurige Gegevensrijen</button>

| <section id="resultaatContainer"> | <section id="resultaatContainer"> |
| --- | --- |
| <h2>Geselecteerde Gegevens</h2> | <h2>Geselecteerde Gegevens</h2> |
| </section> | </section> |
| </main> | </main> |

    <script src="script.js"></script> </body>
</html>
```

```
document.addEventListener('DOMContentLoaded', () => {
    const selectButton = document.getElementById('selectButton');
    const resultaatContainer = document.getElementById('resultaatContainer');

| const MAX_RANGE = 25 |  |
| --- | --- |
| const COUNT = 3 |  |

    selectButton.addEventListener('click', fetchDataAndSelect);

| const response = await fetch('data.json') |  |
| --- | --- |
| throw new Error('Fout bij het laden van data.json') |  |
| const fullData = await response.json() |  |

            // Filter de data tot de maximale rijen (1 tot 25)
            const availableData = fullData.slice(0, MAX_RANGE);

| resultaatContainer.innerHTML = `<p class="error">Fout: Niet genoeg data beschikbaar (minimaal ${COUNT} rijen nodig).</p>` |  |
| --- | --- |
| return |  |

| const selectedIndices = selectRandomIndices(availableData.length, COUNT) |  |
| --- | --- |
| const selectedData = selectedIndices.map(index => availableData[index]) |  |

            displayResults(selectedData);

| console.error(error) |  |
| --- | --- |
| resultaatContainer.innerHTML = `<p class="error">Er is een fout opgetreden: ${error.message}</p>` |  |

| const indices = Array.from({length: max}, (_, i) => i) | // [0, 1, 2, ..., max-1] |
| --- | --- |
| indices.sort(() => 0.5 - Math.random()) | // Schud de array |
| return indices.slice(0, count) | // Kies de eerste 'count' (3) elementen |

| resultaatContainer.innerHTML = '<p class="info">Geen resultaten gevonden.</p>' |  |
| --- | --- |
| return |  |

        // Creëer de tabel
        let html = '<table><thead><tr>';

| const headers = Object.keys(data[0]) |  |
| --- | --- |
| html += `<th>${header}</th>` |  |
| }) |  |
| html += '</tr></thead><tbody>' |  |

| html += '<tr>' |  |
| --- | --- |
| html += `<td>${item[header]}</td>` |  |
| }) |  |
| html += '</tr>' |  |
| }) |  |

        html += '</tbody></table>';

        // Toon het resultaat
        resultaatContainer.innerHTML = html;
    }
});
```

```
document.addEventListener('DOMContentLoaded', () => {
    const selectButton = document.getElementById('selectButton');
    const resultaatContainer = document.getElementById('resultaatContainer');

| const MAX_RANGE = 25 |  |
| --- | --- |
| const COUNT = 3 |  |

    selectButton.addEventListener('click', fetchDataAndSelect);

| const response = await fetch('data.json') |  |
| --- | --- |
| throw new Error('Fout bij het laden van data.json') |  |
| const fullData = await response.json() |  |

            // Filter de data tot de maximale rijen (1 tot 25)
            const availableData = fullData.slice(0, MAX_RANGE);

| resultaatContainer.innerHTML = `<p class="error">Fout: Niet genoeg data beschikbaar (minimaal ${COUNT} rijen nodig).</p>` |  |
| --- | --- |
| return |  |

| const selectedIndices = selectRandomIndices(availableData.length, COUNT) |  |
| --- | --- |
| const selectedData = selectedIndices.map(index => availableData[index]) |  |

            displayResults(selectedData);

| console.error(error) |  |
| --- | --- |
| resultaatContainer.innerHTML = `<p class="error">Er is een fout opgetreden: ${error.message}</p>` |  |

| const indices = Array.from({length: max}, (_, i) => i) | // [0, 1, 2, ..., max-1] |
| --- | --- |
| indices.sort(() => 0.5 - Math.random()) | // Schud de array |
| return indices.slice(0, count) | // Kies de eerste 'count' (3) elementen |

| resultaatContainer.innerHTML = '<p class="info">Geen resultaten gevonden.</p>' |  |
| --- | --- |
| return |  |

        // Creëer de tabel
        let html = '<table><thead><tr>';

| const headers = Object.keys(data[0]) |  |
| --- | --- |
| html += `<th>${header}</th>` |  |
| }) |  |
| html += '</tr></thead><tbody>' |  |

| html += '<tr>' |  |
| --- | --- |
| html += `<td>${item[header]}</td>` |  |
| }) |  |
| html += '</tr>' |  |
| }) |  |

        html += '</tbody></table>';

        // Toon het resultaat
        resultaatContainer.innerHTML = html;
    }
});
```

```
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    text-align: center;
    margin: 20px;
}

| background-color: #7336b2 | /* Je primaire kleur */ |
| --- | --- |
| color: white |  |
| padding: 20px |  |
| border-radius: 8px 8px 0 0 |  |

h1 {
    margin-top: 0;
}

| background-color: white |  |
| --- | --- |
| padding: 30px |  |
| border-radius: 0 0 8px 8px |  |
| box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) |  |

| background-color: #7336b2 |  |
| --- | --- |
| color: white |  |
| padding: 12px 25px |  |
| border: none |  |
| border-radius: 5px |  |
| cursor: pointer |  |
| font-size: 1.1em |  |
| margin-bottom: 20px |  |
| transition: background-color 0.3s |  |

#selectButton:hover {
    background-color: #5a2a8b;
}

| width: 100% |  |
| --- | --- |
| border-collapse: collapse |  |
| margin-top: 20px |  |

| padding: 10px |  |
| --- | --- |
| border: 1px solid #ddd |  |
| text-align: left |  |

| background-color: #f0f0f0 |  |
| --- | --- |
| font-weight: bold |  |

.error {
    color: red;
    font-weight: bold;
}
```

```
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    text-align: center;
    margin: 20px;
}

| background-color: #7336b2 | /* Je primaire kleur */ |
| --- | --- |
| color: white |  |
| padding: 20px |  |
| border-radius: 8px 8px 0 0 |  |

h1 {
    margin-top: 0;
}

| background-color: white |  |
| --- | --- |
| padding: 30px |  |
| border-radius: 0 0 8px 8px |  |
| box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) |  |

| background-color: #7336b2 |  |
| --- | --- |
| color: white |  |
| padding: 12px 25px |  |
| border: none |  |
| border-radius: 5px |  |
| cursor: pointer |  |
| font-size: 1.1em |  |
| margin-bottom: 20px |  |
| transition: background-color 0.3s |  |

#selectButton:hover {
    background-color: #5a2a8b;
}

| width: 100% |  |
| --- | --- |
| border-collapse: collapse |  |
| margin-top: 20px |  |

| padding: 10px |  |
| --- | --- |
| border: 1px solid #ddd |  |
| text-align: left |  |

| background-color: #f0f0f0 |  |
| --- | --- |
| font-weight: bold |  |

.error {
    color: red;
    font-weight: bold;
}
```

- HTML zorgt voor de structuur (de knop en de plek waar de data moet verschijnen).
- CSS zorgt voor de opmaak (het uiterlijk).
- JavaScript zorgt voor de logica (willekeurige getallen kiezen en data ophalen).

| Key | Value |
| --- | --- |
| Lokaal Excel | bestand: Browsers blokkeren JavaScript om veiligheidsredenen om zomaar bestanden van de harde schijf van de gebruiker te lezen. Dit vereist een server of een bestands-uploader (File API), wat het programma ingewikkelder maakt. |
| Webdata (HTML | tabel): Het rechtstreeks ophalen van data van een externe website (wat we in de Python-versie deden met ) wordt in de browser vaak geblokkeerd door het CORS (Cross-Origin Resource Sharing) beleid van de website. Dit vereist meestal een proxy of een eigen backend-server. |

Kan bovenstaande ook in html gemaalt worden obdersteund door javascript?

Jazeker, het is zeker mogelijk om bovenstaand programma te maken met HTML en JavaScript! 🌐 Dit is de standaard manier om interactieve applicaties in de webbrowser te bouwen, wat het erg gebruiksvriendelijk maakt voor je collega's, omdat ze dan niets hoeven te installeren buiten hun browser.

De aanpak is anders dan met Python/Streamlit:

💻 De Uitdaging: Data Inlezen ⚠️

De grootste uitdaging met JavaScript in een browser is het rechtstreeks inlezen van lokale bestanden (zoals een lokaal Excel-bestand) of het omgaan met cross-origin beperkingen bij het ophalen van webdata:

De Eenvoudigste Oplossing: JSON/CSV Data

Om het simpel te houden en geen server nodig te hebben, is de beste oplossing om je data om te zetten in een JSON-bestand of een CSV-bestand. Dit bestand kun je dan met je HTML-bestand meeleveren en JavaScript kan dit eenvoudig inlezen.

🛠️ De HTML/JavaScript Oplossing

Hieronder vind je de code in drie delen. Ga ervan uit dat je een bestand hebt genaamd data.json in dezelfde map.

Voorbeeld van het data.json bestand:

Zet de eerste 25 datarijen uit je Excel-bestand om naar dit formaat:

JSON
1. HTML (index.html)
HTML
2. JavaScript (script.js)

Dit bestand bevat de logica voor het selecteren en weergeven.

JavaScript
3. CSS (styles.css)

Dit bestand zorgt voor het uiterlijk. Je kunt dit uiteraard verder aanpassen.

CSS

---

**User:**

```
pd.read_html(URL)
```

```
http://jouwserver/api/random-data
```

```
pip install flask pandas
```

```
import pandas as pd
url = 'DE_URL_VAN_DE_TABEL'
df = pd.read_html(url)[0] # Kies de juiste tabel-index
df.to_json('data_van_website.json', orient='records', indent=4)
```

```
import pandas as pd
url = 'DE_URL_VAN_DE_TABEL'
df = pd.read_html(url)[0] # Kies de juiste tabel-index
df.to_json('data_van_website.json', orient='records', indent=4)
```

```
data_van_website.json
```

- Waarom? Om te voorkomen dat kwaadaardige scripts gegevens stelen.
- Resultaat: Tenzij de server van de website met de tabel expliciet toestemming geeft (via HTTP headers), zal je JavaScript-code een fout geven wanneer je probeert de tabel op te halen. Dit gebeurt bij de meeste grote websites, waaronder Wikipedia.

| Key | Value |
| --- | --- |
| Python Script (Backend) | Je schrijft een klein Python-programma (bijvoorbeeld met Flask of FastAPI) dat draait op een server. Dit programma voert de uit, haalt de data op zonder CORS-beperkingen, en verpakt de data als JSON. |
| JavaScript (Frontend) | Jouw index.html roept dan dit eigen Python-programma aan (bijvoorbeeld via een URL als ) in plaats van de externe website. |
| Resultaat | Omdat je nu data van je eigen domein ophaalt, omzeil je het CORS-probleem. |

| Key | Value |
| --- | --- |
| Python | Nodig voor de backend-server. |
| Flask/FastAPI | Om een eenvoudige API te bouwen. () |
| JavaScript fetch() | Om de data op te halen van je eigen API. |

| Key | Value |
| --- | --- |
| Handmatige Conversie | Gebruik de eerder gemaakte Python-script met Pandas om de data van de website eenmalig op te halen en lokaal op te slaan als een JSON- of CSV-bestand.Python |
| Vernieuwen | Wanneer de data op de website verandert, moet je deze stap handmatig herhalen. |
| HTML/JavaScript | Je gebruikt vervolgens het HTML/JavaScript-script uit het vorige antwoord om de data te lezen uit dit lokale bestand. |

Ok en hoe zit het wanneer ik geen excel bestand gebruik maar wen tabel van een website?

Je vraagt hoe je de data van een HTML-tabel op een website kunt gebruiken in je HTML/JavaScript-programma, in plaats van een lokaal JSON-bestand.

Dit is technisch mogelijk, maar brengt een grote uitdaging met zich mee in de browser: het CORS (Cross-Origin Resource Sharing)-beleid.

⚠️ De CORS-Uitdaging (De Grootste Hinderpaal)

Browsers passen een veiligheidsregel toe die CORS heet. Deze regel voorkomt dat JavaScript op een willekeurige webpagina (jouw index.html) zomaar data ophaalt van een andere website (de site met de tabel).

🛠️ Oplossing: Een Backend Server of Proxy (Aanbevolen)

De meest betrouwbare oplossing is om de data-ophaling te verplaatsen naar een omgeving die niet onderworpen is aan de browserbeperkingen. Dit betekent dat je de Python-logica (die we eerder hadden) gebruikt om de data op te halen en deze beschikbaar maakt voor je JavaScript-frontend.

Concept: De "Proxy-Service"

Wat je nodig hebt:

💡 Oplossing Zonder Server: JSON Levering (Meest Eenvoudig)

Als je geen server wilt opzetten, moet je het proces handmatig uitvoeren:

Dit is de enige eenvoudige, browser-compatibele manier om dit te doen zonder een server op te zetten.

---

**User:**

| Optie | Programmeertaal | Waar het draait | Installatie Collega's | Best voor |
| --- | --- | --- | --- | --- |
| Python + Streamlit (.exe) | Python | Desktop / Browser | Geen (na .exe conversie) | Snelle, schone app. |
| HTML + JavaScript | JavaScript | Browser | Geen | Maximaal deelgemak (maar beperkt tot CORS). |
| Excel/Sheets Macro | VBA / App Script | Excel / Google Sheets | Geen | Snel resultaat binnen spreadsheet. |
| Python + Flask/Django | Python | Server / Web | Geen | Robuuste oplossing, perfect voor webdata. |
| Power Apps | Low-Code | Browser / Mobiel | Geen | Microsoft 365 omgevingen. |

| Key | Value |
| --- | --- |
| Excel (VBA) | Je gebruikt VBA (Visual Basic for Applications) om een macro te schrijven. Deze macro genereert de willekeurige getallen en selecteert de corresponderende rijen binnen hetzelfde Excel-bestand of een gelinkt bestand. |
| Google Sheets (App Script) | Je gebruikt Google Apps Script (gebaseerd op JavaScript) om de logica te bouschrijven. Dit script wordt geactiveerd door een knop in de Sheet en kan zelfs data van een externe URL ophalen, mits die URL niet te strikte CORS-regels heeft. |

| Key | Value |
| --- | --- |
| Geen installatie | Werkt direct in Excel of de browser (Google Sheets). |
| Bekende omgeving | Je collega's zijn al gewend aan de interface. |
| Eenvoudig delen | Delen is zo simpel als het delen van het spreadsheetbestand. |

| Key | Value |
| --- | --- |
| Functionaliteit | De presentatie is beperkt tot de spreadsheet-opmaak. |
| Onderhoud | VBA kan lastig zijn om te debuggen en te onderhouden. |

| Key | Value |
| --- | --- |
| Je bouwt een kleine webapplicatie met een Python | framework zoals Flask of Django. |
| De Backend (Python) | Flask verwerkt de logica: het haalt de webdata op met Pandas (geen CORS-problemen) en kiest de willekeurige rijen. |
| De Frontend (HTML/CSS) | De applicatie genereert vervolgens een HTML-pagina om de resultaten mooi te presenteren. |

| Key | Value |
| --- | --- |
| CORS Oplossing | Hiermee omzeil je de CORS-problemen bij het ophalen van data van externe websites. |
| Schaalbaar | De app is gemakkelijk uit te breiden met bijvoorbeeld gebruikersaccounts of een database. |
| Volledige controle | Je hebt volledige controle over zowel de logica als het uiterlijk. |

| Key | Value |
| --- | --- |
| Server vereist | Je moet de applicatie hosten op een server (zelfs als dat een kleine lokale server is) om je collega's toegang te geven. |
| Complexiteit | Vereist meer kennis van webontwikkeling (routing, templating, etc.) dan Streamlit. |

- Je gebruikt de grafische interface van Power Apps om de applicatie te bouwen.
- Je definieert de dataverbinding (bijvoorbeeld naar een SharePoint-lijst, een database of zelfs Excel Online) en stelt de logica in (willekeurige selectie) zonder veel code te schrijven.

| Key | Value |
| --- | --- |
| Low | Code: Zeer snel te bouwen zonder diepe codekennis. |
| Integratie | Integreert naadloos met andere Microsoft-tools (SharePoint, Teams). |
| Apps en Mobiel | Werkt direct als mobiele app of in een browser. |

| Key | Value |
| --- | --- |
| Licenties | Vereist specifieke Microsoft Power Apps-licenties. |
| Kosten | Kan duurder zijn dan een gratis open-source oplossing (Python). |
| Beperkte Logica | Soms is complexe willekeurige logica lastiger te implementeren dan in pure Python/JavaScript. |

Zijn er nog andere manieren om een tool te maken zoals ik die voor ogen heb?

Dat is een goede vraag! Zeker, er zijn nog verschillende andere manieren om zo'n tool te maken, elk met hun eigen voor- en nadelen op het gebied van gebruiksgemak, installatie en functionaliteit.

Je hebt al gekeken naar Python met Streamlit (eenvoudige desktop/web app) en HTML/JavaScript (pure browseroplossing).

Hier zijn drie andere populaire opties die je kunt overwegen:

1. Google Sheets / Excel met Scripts (Laagdrempelig) 📊

Dit is een zeer laagdrempelige oplossing, ideaal als je collega's al veel met spreadsheets werken.

Hoe werkt het?
Voordelen
Nadelen
2. Python met Flask of Django (Robuuste Web App) 🏗️

Dit is de "professionele" aanpak voor een webapplicatie.

Hoe werkt het?
Voordelen
Nadelen
3. Microsoft Power Apps (Low-Code/No-Code) 📱

Als jouw organisatie Microsoft 365 gebruikt, is dit een low-code oplossing.

Hoe werkt het?
Voordelen
Nadelen
Samenvatting van de Opties
Exporteren naar Spreadsheets