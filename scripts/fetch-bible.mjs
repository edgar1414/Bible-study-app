import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(import.meta.dirname, '..', 'public', 'bible');
mkdirSync(OUTPUT_DIR, { recursive: true });

const books = [
  ["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],
  ["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],
  ["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],
  ["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],
  ["Proverbs",31],["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],
  ["Jeremiah",52],["Lamentations",5],["Ezekiel",48],["Daniel",12],["Hosea",14],
  ["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],["Micah",7],["Nahum",3],
  ["Habakkuk",3],["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4],
  ["Matthew",28],["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],
  ["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],
  ["Philippians",4],["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],
  ["1 Timothy",6],["2 Timothy",4],["Titus",3],["Philemon",1],["Hebrews",13],
  ["James",5],["1 Peter",5],["2 Peter",3],["1 John",5],["2 John",1],
  ["3 John",1],["Jude",1],["Revelation",22]
];

// Map from our book names to the repo file names on GitHub
const repoNameMap = {
  "1 Samuel": "1Samuel",
  "2 Samuel": "2Samuel",
  "1 Kings": "1Kings",
  "2 Kings": "2Kings",
  "1 Chronicles": "1Chronicles",
  "2 Chronicles": "2Chronicles",
  "Song of Solomon": "SongofSolomon",
  "1 Corinthians": "1Corinthians",
  "2 Corinthians": "2Corinthians",
  "1 Thessalonians": "1Thessalonians",
  "2 Thessalonians": "2Thessalonians",
  "1 Timothy": "1Timothy",
  "2 Timothy": "2Timothy",
  "1 Peter": "1Peter",
  "2 Peter": "2Peter",
  "1 John": "1John",
  "2 John": "2John",
  "3 John": "3John",
};

const BASE_URL = 'https://raw.githubusercontent.com/aruljohn/Bible-kjv/master';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchBook(bookName) {
  const repoName = repoNameMap[bookName] || bookName;
  const url = `${BASE_URL}/${repoName}.json`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
      const data = await resp.json();

      // Convert to our format
      const converted = {
        book: bookName,
        chapters: data.chapters.map(ch => ({
          chapter: parseInt(ch.chapter, 10),
          verses: ch.verses.map(v => ({
            verse: parseInt(v.verse, 10),
            text: v.text
          }))
        }))
      };

      const outPath = join(OUTPUT_DIR, `${bookName}.json`);
      writeFileSync(outPath, JSON.stringify(converted, null, 2));
      console.log(`OK: ${bookName} (${converted.chapters.length} chapters)`);
      return true;
    } catch (err) {
      console.error(`Attempt ${attempt+1} failed for ${bookName}: ${err.message}`);
      if (attempt < 2) await delay(1000);
    }
  }
  return false;
}

async function main() {
  console.log(`Fetching ${books.length} books...`);
  let success = 0, failed = [];

  // Process in batches of 5 to avoid overwhelming
  for (let i = 0; i < books.length; i += 5) {
    const batch = books.slice(i, i + 5);
    const results = await Promise.all(batch.map(([name]) => fetchBook(name)));
    results.forEach((ok, idx) => {
      if (ok) success++;
      else failed.push(batch[idx][0]);
    });
    if (i + 5 < books.length) await delay(200);
  }

  console.log(`\nDone: ${success}/${books.length} books fetched.`);
  if (failed.length) console.log(`Failed: ${failed.join(', ')}`);
}

main();
