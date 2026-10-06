# Quote attribution and source audit

This document records the source-linking policy and the changes made to the
teaching catalogue so quotations remain traceable in the app, generated reels,
saved reels, and script exports.

## Attribution policy

- `src/data/teachings.ts` is the source of truth for each teaching's wording,
  source name, volume, chapter, status, and `sourceUrl`.
- “Open original source” always uses that record's `sourceUrl`; the interface
  does not substitute a generic archive homepage or label a different site as
  the destination.
- Reel source cards and script exports carry the original English wording and
  the exact source URL. When Hindi is selected, the reel labels its Hindi text
  as a translation and keeps the English source wording and link available.
- User-added records are labelled unverified until their wording and source
  have been independently reviewed.
- The source link is a direct online reference, not a claim of institutional
  endorsement.

## Catalogue change log

| Date | Record(s) | Change |
|---|---|---|
| 2026-10-07 | q16 → q01 | Removed a duplicate of “Each Soul Is Potentially Divine”; q01 remains the catalogue record and source of its citation. |
| 2026-10-07 | q21 → q14 | Removed a duplicate of “Have Faith in Yourself”; q14 remains the catalogue record and source of its citation. |
| 2026-10-07 | All records | No surviving English quotation text was rewritten in this integration pass. Each direct source URL returned HTTP 200, and the normalized opening words of the stored quotation were found on the linked page. Hindi reel wording is identified as a translation rather than a verbatim English quotation. |
| 2026-10-07 | App, saved reels, and exports | Carried the source URL and original quotation into reel provenance, added direct source links to reel views and exports, and refreshed previously saved reels from the current catalogue. |

The ID gaps are intentional for compatibility with saved reels. Legacy IDs q16
and q21 resolve to q01 and q14 respectively.

The HTTP and text checks confirm that the links resolve and point to pages
containing the quotation opening. They do not replace a scholarly edition or
publisher review. Consult the linked page for the full passage and edition
context.

## Catalogue references

The table lists the active catalogue records. The quoted wording itself is
maintained in `src/data/teachings.ts`; links below are each record's direct
source URL.

| ID | Teaching | Volume and chapter/section | Direct source |
|---|---|---|---|
| q01 | Each Soul Is Potentially Divine | Vol. 1 — Raja-Yoga, Preface | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_1/raja-yoga/preface.htm) |
| q02 | Manifest the Divinity Within | Vol. 1 — Raja-Yoga, Preface | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_1/raja-yoga/preface.htm) |
| q03 | All the Powers Are Already Ours | Vol. 2 — Practical Vedanta, Part I | [Source page](https://mail.ramakrishnavivekananda.info/vivekananda/volume_2/practical_vedanta_and_other_lectures/practical_vedanta_part_i.htm) |
| q04 | Strength Is Life | Vol. 2 — Work and its Secret | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_2/work_and_its_secret.htm) |
| q05 | Education Is Manifestation | Vol. 4 — What We Believe In | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_4/writings_prose/what_we_believe_in.htm) |
| q06 | Religion Is Divine Manifestation | Vol. 4 — What We Believe In | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_4/writings_prose/what_we_believe_in.htm) |
| q07 | Live for Others | Vol. 4 — Our Duty to the Masses | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_4/writings_prose/our_duty_to_the_masses.htm) |
| q08 | Take Care of What You Think | Vol. 7 — Inspired Talks, June 26, 1895 | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_7/inspired_talks/05_wednesday_june_26.htm) |
| q09 | Be True to Your Own Nature | Vol. 1 — Lectures and Discourses, “Mohammed” | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_1/lectures_and_discourses/mohammed.htm) |
| q10 | Truth Has Many Expressions | Vol. 5 — Sayings and Utterances | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_5/sayings_and_utterances.htm) |
| q11 | Grow From Inside Out | Vol. 5 — Sayings and Utterances | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_5/sayings_and_utterances.htm) |
| q12 | The World Will Reveal Its Secrets | Vol. 1 — Raja-Yoga, Introductory | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_1/raja-yoga/introductory.htm) |
| q13 | Condemn None | Vol. 2 — Practical Vedanta, Part I | [Source page](https://mail.ramakrishnavivekananda.info/vivekananda/volume_2/practical_vedanta_and_other_lectures/practical_vedanta_part_i.htm) |
| q14 | Have Faith in Yourself | Vol. 3 — The Mission of the Vedanta | [Source page](https://ramakrishnavivekananda.info/vivekananda/volume_3/lectures_from_colombo_to_almora/the_mission_of_the_vedanta.htm) |
| q15 | Feel for the Downtrodden | Vol. 4 — To My Brave Boys | [Source page](https://www.ramakrishnavivekananda.info/vivekananda/volume_4/writings_prose/to_my_brave_boys.htm) |
| q17 | Realisation Is Real Religion | Vol. 1 — Raja Yoga, Patanjali's Yoga Aphorisms, Chapter 1 | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-101-11957/) |
| q18 | Do Good for Its Own Sake | Vol. 1 — Karma Yoga, “Freedom” | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-42-6682/) |
| q19 | Love, Truth and Unselfishness | Vol. 1 — Karma Yoga, “Karma in its effect on Character” | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-53-7324/) |
| q20 | Live for an Ideal | Vol. 2 — Hints on Practical Spirituality | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-63-8379/) |
| q22 | All Power Is Within You | Vol. 3 — The Work Before Us | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-52-7304/) |
| q23 | Learn Without Becoming Others | Vol. 3 — The Common Bases of Hinduism | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-109-12528/) |
| q24 | The True Teacher | Vol. 4 — My Master, Part 1 | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-113-12698/) |
| q25 | Lend a Hand to Every Worker of Good | Vol. 4 — Reply to Madras Address | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-96-10413/) |
| q26 | Iron Nerves and an Intelligent Brain | Vol. 6 — From the Diary of a Disciple, II | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-60-8156/) |
| q27 | Never Lose Faith in Yourself | Vol. 7 — Inspired Talks, August 1 | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-110-12620/) |
| q28 | The Lion Within | Vol. 7 — Conversations and Dialogues, XXVI | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-20-12424/) |
| q29 | The Brave Alone Do Great Things | Vol. 5 — Epistles, XLIII | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-116-13973/) |
| q30 | Yoga and Knowledge | Vol. 1 — Raja Yoga in Brief | [Source page](https://media.belurmath.org/inspiration-swami-vivekananda-61-8331/) |
