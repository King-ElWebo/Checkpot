# Checkpot EmpCo claim audit — Austria, 29 September 2026

Status: targeted changes applied in `feature/empco-compliance`; standalone GOTS and Fair Wear marks removed in closeout; Strikkeby image evidence remains. This is an editorial and technical audit, not a formal legal opinion or certification. The complete exact old/new database fields and row IDs are in [`EMPCO-DB-CHANGESET.json`](./EMPCO-DB-CHANGESET.json), the four guarded material-wording edits in [`EMPCO-DB-FOLLOWUP.json`](./EMPCO-DB-FOLLOWUP.json), and two certification-scope edits in [`EMPCO-DB-CERTIFICATION-SCOPE.json`](./EMPCO-DB-CERTIFICATION-SCOPE.json). The live database returned 16 active brands and 5 inactive brands on 29 September 2026; the brief's count of 15 was outdated. All 16 active records were reviewed.

## Final closeout

Read-only Neon inspection found `zilch` active (preview route available), `danefae` inactive (preview route not published), and `strikkeby` active (preview route available). The current Website Lock shows Coming Soon to ordinary visitors on these paths; no active flag changed.

The only named Strikkeby media record is `f3e1a9d3-1661-4d77-bc74-804454de949d` (`brands/strikkeby-v2.jpg`). No other approved Strikkeby asset or outfit-linked image was found. The image is a close-up label with “økologiske” centered directly beneath the brand name; a crop that removes the term would damage the composition. No media change was made. Owner/supplier evidence is required.

## Governing source and classification key

A = clearly safe/factual in context; B = needs narrowing; C = needs evidence before an unqualified claim; D = remove unsupported claim; E = human/legal/trademark review. These are risk assessments, not categorical legal rulings.

- Austrian [UWG § 1 definitions](https://ris.bka.gv.at/Dokumente/Bundesnormen/NOR40279746/NOR40279746.html), [§ 2 misleading practices](https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40279748/NOR40279748.html), and [Annex 1](https://ris.bka.gv.at/Dokumente/Bundesnormen/NOR40279754/NOR40279754.html), all effective 27 September 2026: generic environmental claims, misleading whole-business/product scope, improper sustainability labels, unsupported future claims and false durability claims are the relevant risks.
- [WKO Umweltwerbung guidance](https://www.wko.at/wettbewerbsrecht/umweltwerbung-unlauterer-wettbewerb), updated 17 September 2026, applies the Austrian implementation to websites and explains that specific, true, evidenced statements remain possible. [Directive (EU) 2024/825](https://eur-lex.europa.eu/eli/dir/2024/825/oj) supplies the EU background, including social and environmental breadth of “sustainable”.
- [GOTS Conditions for Use of Signs v4.0](https://global-standard.org/images/resource-library/documents/licensing-and-labelling/Conditions%20for%20Use%20of%20Signs%20-%20GOTS%20V%204.0.pdf), effective 1 August 2026, §§ 3.5.6 and 5.1.13: an uncertified retailer's off-product use has declaration and presentation conditions. The [GOTS supplier database guidance](https://global-standard.org/find-suppliers-shops-and-inputs/certified-suppliers/database/search_result/30234) stresses valid scope certificates and separately labelled products.
- [Fair Wear FAQ](https://www.fairwear.org/faqs): membership concerns brands and due diligence; it is not product certification. Third-party reseller logo use requires checking the source brand and communication rules. [Fair Wear's current Madness page](https://www.fairwear.org/brands/madness) lists that brand as a member and a March 2026 report.
- [B Lab's Seasalt entry](https://www.bcorporation.net/en-us/find-a-b-corp/company/seasalt-limited/) verifies a company certification, not every garment. [Lenzing brand guidance](https://www.lenzing.com/products/brands/) concerns fibre claims and licensed trademark communication. [Sedex SMETA guidance](https://www.sedex.com/solutions/smeta-audit/) describes an audit, not a “Sedex certification”.

No public future environmental target, product carbon-neutral claim or broad Checkpot-wide certification claim was found in current production feeds. Historical research mentions a Seasalt net-zero target; it was not imported into current copy.

## Current public/static inventory

| Location | Exact old claim or label | Type | Evidence / basis | Class | Action | Final wording/status |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage desktop | “Ausgewählte Fair- und Slow Fashion, für alle, die lieber ihren eigenen Stil als Einheitsbrei tragen.” | Whole assortment/social/environmental | Mixed brand credentials do not establish all stock; UWG scope rule | B | Narrow | “Ausgewählte Mode für alle, die lieber ihren eigenen Stil als Einheitsbrei tragen.” |
| Homepage mobile hero | “Individuelle Fair- und Slow Fashion” | Assortment claim | Same | B | Narrow | “Individuelle Mode” |
| Homepage `/` metadata | “Nachhaltige Kollektionen” in root/public defaults | Generic environmental | UWG § 1, Annex 1 | B | Narrow | “ausgewählte Marken” / factual boutique copy |
| `/mode` visible copy | “zeitlos” style and styling/combination language | Style, not measured durability | Contextual reading | A | Keep | Unchanged; no environmental assertion |
| `/marken` visible copy | Selected brands, style and quality | Assortment facts | Contextual reading | A | Keep | Unchanged |
| `/fair-trade` hero | “Bewusster auswählen”; quality, materials and traceable brand information | Selection/process | Context makes selection meaning clear | A | Keep | Unchanged |
| `/fair-trade` principles | “Qualität, die bleiben darf”; “Gute Verarbeitung ... vor kurzlebigen Effekten” | Style/selection, not objective service-life promise | Contextual reading | A | Keep | Unchanged |
| `/fair-trade` principles | “Transparenz statt großer Versprechen”; “Konkrete Angaben ... wo sie nachvollziehbar belegt sind” | Disclosure practice | Page and brand records | A | Keep | Unchanged |
| `/fair-trade` standards intro | “Bei einzelnen Marken können konkrete Standards oder Mitgliedschaften nachvollziehbar belegt werden.” | Properly scoped standard/membership | Brand sources below | A | Keep | Unchanged |
| `/fair-trade` GOTS text | “GOTS ist ein Standard für Textilien aus ökologisch erzeugten Naturfasern mit definierten Umwelt- und Sozialkriterien ...” | Scheme explanation | GOTS standard and signs conditions | A | Keep | Unchanged; no Checkpot stock-wide claim |
| `/fair-trade` Fair Wear text | “Fair Wear arbeitet mit Mitgliedsmarken an besseren Arbeitsbedingungen und menschenrechtlicher Sorgfalt ...” | Initiative explanation | Fair Wear FAQ | A | Keep | Unchanged; no product certification claim |
| `/fair-trade` GOTS logo | `/customer/standards/gots-logo_cmyk.jpg` | Trademark/seal | GOTS signs conditions §§ 3.5.6, 5.1.13 | E | Remove from public page | Standalone mark removed; rights and presentation conditions must be verified before any reuse |
| Strikkeby brand photo | Garment label visibly reads “strikkeby økologiske” | Embedded environmental wording | Current Checkpot brand image; Checkpot article and label evidence not yet supplied | C/E | Retain after alternative/crop review | Sole active Strikkeby image; its centered label cannot be naturally cropped clear of “økologiske”. Owner/supplier evidence required |
| `/fair-trade` Fair Wear logo | `/customer/standards/hd_logo_fairwear.jpg` | Trademark | Fair Wear FAQ | E | Remove from public page | Standalone mark removed; reseller permission and current asset must be verified before any reuse |
| Navbar/footer | “Fair Trade” | Potentially broad label | Page is about quality, origin and mixed standards/initiatives | B | Rename visible label only | “Qualität & Herkunft”; URL remains `/fair-trade` |
| `/fair-trade` fixture metadata | “Fair Trade & Nachhaltigkeit”; “faire, nachhaltige und langlebige Damenmode” | SEO marketing | Austrian UWG applies to advertising across media | B/D | Narrow | “Qualität, Herkunft & Transparenz”; information on materials, quality and traceable brand information |
| `/fair-trade` generated description | “geprüften Markenstandards” | Could imply independent approval for all | Current page and brand data | B | Narrow | “nachvollziehbaren Markenangaben” |
| Admin brand editor placeholders | Broad material/certification examples | Future input guidance | Could induce unsupported new public copy | B | Make examples factual | Scoped material and manufacturer-sourced examples; existing evidence warning retained |
| Public legal pages | No directly relevant error found | Legal copy | Scope search | A | Keep | `/impressum` and `/datenschutz` untouched |

The source search also covered navigation, footer, alt text, JSON-LD, schema and public assets. `BreadcrumbList` structured data follows visible labels; no sustainability Product/Organization schema was found. The old `/fair-trade` URL and existing redirects were retained. Current website lock displays Coming Soon to ordinary visitors; local signed preview was used for page QA without changing lock state.

## Database-backed brand inventory (all 16 active)

The table records the material claim of each brand; the linked JSON ledgers contain every exact changed sentence, claim-list entry and SEO field. Brand facts are from current scheme owner or manufacturer material, attributed where appropriate. A label's selected GOTS items do not establish that a Checkpot-stocked article is GOTS-labelled.

| Brand / location | Old claim (exact excerpt) | Type and source | Class | Action | Final status / wording |
| --- | --- | --- | --- | --- | --- |
| Zilch | No environmental claim; empty claim list | Current DB | A | Keep | No issue |
| Sorgenfri | Style and fit only | Current DB | A | Keep | No issue |
| Lykka du Nord | “Verarbeitung von Bio-Baumwolle ...”; “Fertigung in europäischen Partnerbetrieben” | Whole-brand materials/origin; [Scandic individual listings](https://scandic-shop.de/de_de/marken/lykka-du-nord) do not prove Checkpot items | C | Remove unsupported details | Designs and soft fabrics only |
| Seasalt | “starkes Engagement für Nachhaltigkeit”; “... beweist ... verantwortungsvoller Umgang”; broad GOTS/durability | Generic/business/product scope; [Seasalt](https://www.seasaltcornwall.com/ie/sustainability), [B Lab](https://www.bcorporation.net/en-us/find-a-b-corp/company/seasalt-limited/) | B | Narrow | Seasalt Holdings Limited B Corp since July 2024; selected manufacturer-listed GOTS articles; style facts |
| Pretty Vacant | “... mit GOTS-zertifizierter Bio-Baumwolle”; “viele Kleidungsstücke ...”; “konsequent ... natürliche Monofasern” | Whole-brand inference; [manufacturer](https://www.prettyvacantclothing.com/pages/about-us) and [selected product](https://www.prettyvacantclothing.com/collections/knitwear/products/pineapple-knit) | B | Narrow | Selected manufacturer-listed GOTS models; design facts |
| Cissi och Selma | “Slow-Fashion”; general “Fokus auf Bio-Baumwolle und OEKO-TEX®-zertifizierte Stoffe” | Broad label/material; [manufacturer](https://www.cissiochselma.se/sv/hallbarhet/) | B/C | Narrow | Retro mode; selected organic-cotton models per manufacturer |
| LaLamour | “zertifizierten Materialien und langlebiger Slow-Fashion”; “geprüften Fertigungsstätten” | Generic/durability/unsupported approval; [manufacturer](https://www.lalamour.eu/pages/about-us) | B/C | Narrow | Selected GOTS-cotton pieces per manufacturer; Turkish production partners attributed |
| Nomads | “umweltfreundlichen Farben”; “ethischen Fair-Trade-Partnerbetrieben” | Generic environment and unqualified social claim; [manufacturer cotton page](https://nomadsclothing.com/pages/cotton) | B | Narrow | Selected GOTS models; Indian partners described under manufacturer's own Fair-Trade-Policy; block printing |
| Strikkeby | “nachhaltige ... 100% Bio-Baumwolle ... ökologisch zertifiziert”; “GOTS-zertifizierte Materialien” | Whole-brand / Checkpot-article implication; [Scandic selected article](https://scandic-shop.de/de_de/strickpullover-flekkina-lake-blau-06252-0016-321) only | D | Remove | Nordic knit design and patterns; no new article attribute invented |
| Circus | “Fokus auf reine Naturfasern”; “Ethische Fertigung in einem nach SEDEX-Kriterien auditierten Partnerbetrieb” | Material scope/social audit; [manufacturer](https://www.circuswholesale.ie/cw_ie/sustainability), [Sedex](https://www.sedex.com/solutions/smeta-audit/) | B | Narrow | Named fibres in parts of range; manufacturer says Indian partner has regular social audits |
| Angels | “langlebiger Passformtreue”; “dauerhafte Formstabilität” | Objective durability; [manufacturer](https://www.angels-jeans.de/eu/de/angels-cares) | C | Remove unsupported performance claim | Fit-focused design and European manufacturing |
| Stehmann | “Überwiegende Fertigung in ... europäischen Partnerbetrieben”; BSCI and OEKO-TEX blanket claim | Factory-share vs product-share ambiguity; [manufacturer](https://stehmann-store.de/pages/nachhaltigkeit/) | B/C | Narrow | Manufacturer says production partners predominantly in Europe; no blanket certification |
| Emily van den Bergh | Style/viscose/cotton description only | Current DB | A | Keep | No issue |
| Madness | “Ökologische Naturtextil-Pionierin”; “garantiert höchste ökologische Standards und faire Arbeitsbedingungen”; all products GOTS | Generic guarantee/whole assortment; [manufacturer](https://madness-online.com/), [current Fair Wear directory](https://www.fairwear.org/brands/madness) | B/D | Narrow | Company-level GOTS since 2012 per maker; Fair Wear member confirmed; organic materials in parts of collection, not every Checkpot item |
| Heidekönigin | “spürbare Langlebigkeit”; “gesamte Kollektion ausnahmslos ...”; “schonenden Umgang mit unserer Umwelt” | Objective durability/environmental scope; [manufacturer](https://www.heidekoenigin.de/idee/gots/) | B/C | Narrow | Europe production and manufacturer-reported own GOTS certification; article label controls item certification |
| King Louie | “Nachhaltigkeit wird ... großgeschrieben”; all-range GOTS/BSCI/Lenzing implication | Generic/whole brand; [manufacturer current selected items](https://kinglouie.com/collections/sale-jumpsuits) | B/C | Narrow | Selected manufacturer-listed GOTS organic-cotton items; no aggregate sustainability claim |

Inactive Danefae and Moshiki retain historical material/green claims in unpublished records; Moshiki also has one “Bio-Mode” media alt. They were not changed because both brands are inactive. Re-audit before either brand or its media is republished. Other inactive brands were not public claims. Historical `BRAND-RESEARCH`, `BRAND-CONTENT-DRAFT`, `BRAND-CLAIM-AUDIT.csv` and August `BRAND-CONTENT-APPROVAL.md` contain superseded phrases and are not live content feeds; the approval file is marked historical. The current user instruction and this audit supersede those phrases for publication.

## Other database text

| Location | Exact old claim | Type / evidence | Class | Action | Final wording |
| --- | --- | --- | --- | --- | --- |
| Outfit `33dcd90f-0340-4241-b40b-cb27b8f1b023` availability note | “Lieblings-Herbstkombination aus Naturfasern” | Unverified garment composition | C | Narrow | “Lieblings-Herbstkombination” |
| Outfit `03a35bda-0660-455c-9f58-af3daf9a92f2` availability note | “Naturmaterialien in langlebiger Qualität” | Unverified material/durability | C | Narrow | “Materialdetails im Geschäft erfragen” |
| Madness media `664ed0d2-227c-469b-920c-26896d7319c0` | “Madness Fair Fashion bei Checkpot Wien-Hietzing” | Broad alt marketing | B | Narrow | “Madness Damenmode bei Checkpot Wien-Hietzing” |
| Strikkeby media `f3e1a9d3-1661-4d77-bc74-804454de949d` | “Strikkeby Bio-Strickmode bei Checkpot Wien-Hietzing” | Unverified material alt | C | Narrow | “Strikkeby Strickmode bei Checkpot Wien-Hietzing” |
| Nomads media `31cdb9c4-d29c-47fc-9956-a725c482a3f9` | “Nomads Fair Fashion bei Checkpot Wien-Hietzing” | Broad social alt | B | Narrow | “Nomads Damenmode bei Checkpot Wien-Hietzing” |
| `page_content`, `system_settings`, collections and outfit taxonomies | No matching public environmental claim | Current DB scan | A | Keep | No changes |

The initial 18 row updates, four material-wording updates and two certification-scope updates (18 distinct rows in total) used active/current-value guards. The second database scan found no matching claim in active outfits, page_content, system_settings, collections, taxonomy or active media; active brand matches are the scoped claims in the table. The only remaining media match belongs to inactive Moshiki.

## Owner follow-up and release note

1. Christa or the supplier should provide item labels and current proof for any Checkpot-specific GOTS, organic, LENZING/ECOVERO or other material statement before attaching it to an individual garment. Scandic guidance was applied to Lykka and Strikkeby; no Scandic article-level content was added. The Strikkeby hero photo itself contains “økologiske” on a textile label; Christa/Scandic should confirm the photographed item and whether the implied organic claim is accurate for Checkpot stock.
2. The standalone GOTS logo is removed. Before any future reuse, obtain/confirm the retailer declaration, approved current asset, actual labelled stock, and certification details required for the exact presentation under GOTS signs rules.
3. The standalone Fair Wear logo is removed. Before any future reuse, ask the member brand/Fair Wear to confirm reseller use and current asset/placement. Madness membership alone does not grant Checkpot logo permission.
4. No standalone GOTS or Fair Wear mark remains on the current page. The accurate explanations remain. Legal counsel may review any future proposed logo use if the owner needs a definitive rights position.

## Verification

On a locally signed preview (the public Website Lock remained active), `/`, `/fair-trade`, `/mode`, `/marken`, and `/marken/strikkeby`, `/seasalt`, `/madness`, `/king-louie` were inspected at 1440×900 and 390×844. No horizontal overflow or broken navigation label was observed; affected titles/descriptions rendered, and the GOTS/Fair Wear explanatory text remained after standalone logo removal. `npm run typecheck`, `npm run lint` and `npm run build` passed. No commit, push, merge or deployment was performed.
