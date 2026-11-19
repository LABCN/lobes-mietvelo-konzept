# Lobes Bikes – Design-Tokens für die Velo-Miet-App

Diese Tokens sind für die Theme-Erweiterung «Velo Miete» (Block `rental-picker`) und das Velo-Portal (`/apps/velo/portal` und die Kundenkonto-Erweiterung «Mein Velo»).
Sie stammen aus der Designvorschau https://labcn.github.io/lobes-mietvelo-konzept/ (Abschnitte `#abo-ablauf`, `#stundenmiete` und `#konto`).
Es ist nur ein Vorschlag. Im Live-Shop wird nichts ohne Lorenzos OK umgesetzt.

## Farben
| Token | Wert | Einsatz | ersetzt in der App |
|---|---|---|---|
| `--paper` | `#F3EDE2` | Seitenhintergrund (Creme) | `#f7f4ee` |
| `--paper-2` | `#EEE6D7` | Flächen, Bildhintergrund, Tag «Geschlossen» | – |
| `--sand` | `#E9DCC0` | Hintergrund des Portal-Abschnitts | – |
| `--white` | `#FFFDF8` | Karten (Kalender, Abo, Mieten) | `#fff` |
| `--line` | `#CBBFA8` | Rahmen, Trennlinien | `#d7d1c6` |
| `--ink` | `#1E1B16` | Text | `#1c1a17` |
| `--muted` | `#5B5346` | Sekundärtext, Labels | – |
| `--green` | `#2F4A3A` | Primärbutton, gewählter Tag und Slot, aktiver Tab | `#1f4d3a` |
| `--green-2` | `#24392D` | Hover, Text auf hellgrün | – |
| `--terra` | `#B5603E` | Akzent, CTA «In den Warenkorb» beim Abo, Schritt-Nummern | – |
| `--terra-2` | `#9D4F31` | Hover, Text auf terracotta-hell, Hinweis Mindestlaufzeit | – |

### Kalender-Zustände (`data-state`)
| Zustand | Hintergrund | Text | ersetzt |
|---|---|---|---|
| `free` (Verfügbar) | `#E3EBE3` | `#24392D` | `#e7f2ec` |
| `busy` (Belegt, inkl. Puffer) | `#F1DDD2` | `#9D4F31`, durchgestrichen | `#f3e4df` |
| `closed` (Depot geschlossen) | `#EEE6D7` | `#A89E8C` | `#f3e4df` |
| `past` | transparent | `#5B5346`, Deckkraft .45 | gleich |
| gewählt | `#2F4A3A` | `#F3EDE2` | neu |
| heute | Innenrahmen 1.5px `#1E1B16` | – | neu |

### Status-Pillen (Portal)
- Aktiv: `#E3EBE3` / `#24392D`
- Reserviert, Angefragt: `#F6E6DA` / `#9D4F31`
- Zurück, Beendet: `#EEE6D7` / `#5B5346`
- Hinweis «Gespeichert.» (`.notice`): `#E3EBE3` / `#24392D`, Radius 14px
- Fehler (`.error`): `#F6E6DA` / `#9D4F31`
- Beispiel-Badge (nur in der Vorschau): gestrichelter Rahmen in `#B5603E`

## Schriften
- **Titel:** Fraunces (Google Fonts), `opsz` 144, Gewicht 340–350. Die Hervorhebung ist kursiv in `--green` oder `--terra`.
  - Grössen: Portal-Titel «Mein Velo» `clamp(40px,4.6vw,60px)`, Block-Titel «Velo mieten» 26px, Monat 19px, Preise 20–22px.
- **Text und UI:** Instrument Sans mit 400/500/600/700. Fliesstext 16px, UI 14–15px, Kleingedrucktes 12.5–13.5px.
- **Labels/Eyebrows:** 11–12px, Grossbuchstaben, `letter-spacing .12–.14em`, Gewicht 600–700, Farbe `--muted`.
- **Seriennummern:** `ui-monospace` mit 0.92em.

## Radien
- Grosse Karten (Kalender-Block, Produkt, Abo-Karte): 24–28px
- Innenflächen (Preisbox, Mietzeile): 16–20px
- Kalendertag: 12px (mobil 9px), Höhe 44px (mobil 38px)
- Hinweise: 14px
- Buttons, Chips, Slots, Tabs, Status: 999px (Pille)
- Standardvariable `--r`: 18px

## Buttons
| Variante | Stil | Einsatz |
|---|---|---|
| Primär | `--green` Hintergrund, Text `--paper`, Pille, Padding 14px 26px, 600 | «In den Warenkorb» (Kurzmiete), «Grössere Grösse anfragen» |
| Terra | `--terra` Hintergrund, Text weiss | «In den Warenkorb» beim Abo auf grüner Fläche |
| Outline | transparent, Rahmen 1px `--ink` | «Abo pausieren», «Abo fortsetzen», «Abmelden» |
| Gesperrt | transparent, Rahmen `--line`, Text `#A89E8C`, `cursor:not-allowed` | «Abo kündigen» vor Ende der Mindestlaufzeit, mit Hinweis «Die Mindestlaufzeit ist noch nicht vorbei.» |
| Klein (`btn-sm`) | Padding 10px 18px, 14px | Portal-Aktionen |
| Slot/Chip | Pille, Rahmen `--line`, Padding 7–9px 12–15px, 13.5–14px 600; aktiv: `--green` gefüllt; belegt: gestrichelt und durchgestrichen | Zeit-Slots, Rahmengrösse |
| Tab (Stundenweise/Tageweise) | Segment in `--paper-2`, aktiv `--green` gefüllt | Modus-Wahl statt `<select>` |

Die App-Defaults (`border-radius:4px`, `system-ui`) im `rental-picker.liquid` und in `portal-page.server.ts` sollten durch diese Werte ersetzt werden. Am besten geschieht das über CSS-Variablen im Block, damit das Theme sie überschreiben kann.

## Abstände und Effekte
- Karten-Padding 26px (mobil 20px), Abstand im Kalender 6px (mobil 4px)
- Schatten am Kalender-Block: `0 18px 40px -28px rgba(30,27,22,.35)`
- Breakpoints: 1000px (einspaltig) und 600px (mobil)
