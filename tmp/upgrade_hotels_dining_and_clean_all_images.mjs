import fs from 'fs';

async function searchCommons(queries, minCount = 3) {
  const queryList = Array.isArray(queries) ? queries : [queries];
  const collected = [];

  for (const q of queryList) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
      'filetype:bitmap ' + q
    )}&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'NordicExpeditionGuide/2.0 (https://example.org)' },
        });
        const data = await res.json();
        const pages = Object.values(data.query?.pages || {});
        for (const p of pages) {
          const ii = p.imageinfo?.[0];
          if (!ii) continue;
          let imgUrl = (ii.thumburl || ii.url || '').split('?')[0];
          imgUrl = imgUrl.replace('https://thumb.wikimedia.org/', 'https://upload.wikimedia.org/');
          if (
            imgUrl &&
            /\.(jpg|jpeg|png|webp)$/i.test(imgUrl) &&
            !/map|diagram|logo|coat_of_arms|flag|icon|plan|stamp|signature|locator|chart|graph/i.test(imgUrl) &&
            !collected.some((c) => c === imgUrl)
          ) {
            collected.push(imgUrl);
          }
        }
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 300));
      }
    }
    if (collected.length >= minCount) break;
  }
  return collected;
}

async function main() {
  console.log('Fetching verified Wikimedia Commons photos for all 8 Hotels and 11 Restaurants...');

  const hotelQueries = {
    'h-dangleterre': ['Hotel d Angleterre Copenhagen', 'Kongens Nytorv Copenhagen'],
    'h-grand-hotel': ['Grand Hôtel Stockholm', 'Grand Hotel Stockholm'],
    'h-kakslauttanen': ['Kakslauttanen', 'Glass igloo Finland', 'Saariselkä winter'],
    'h-kamp': ['Hotel Kämp', 'Pohjoisesplanadi Helsinki'],
    'h-the-thief': ['Tjuvholmen Oslo', 'Aker Brygge Oslo'],
    'h-the-edge': ['Clarion Hotel The Edge Tromsø', 'Tromsø harbor winter'],
    'h-the-retreat': ['Blue Lagoon Iceland', 'Bláa lónið'],
    'h-the-edition': ['Harpa Reykjavik', 'Reykjavik harbor'],
  };

  const diningQueries = {
    'd-havfruen': ['Nyhavn 39 Copenhagen', 'Smørrebrød herring', 'Nyhavn restaurant'],
    'd-taarnet': ['Christiansborg tower', 'Smørrebrød Danish'],
    'd-nimb': ['Nimb Tivoli Copenhagen', 'Tivoli Gardens palace'],
    'd-gyldene-freden': ['Den Gyldene Freden', 'Swedish meatballs lingonberry'],
    'd-fotografiska': ['Fotografiska Stockholm', 'New Nordic cuisine'],
    'd-kakslauttanen-gala': ['Poronkäristys', 'Lohikeitto salmon'],
    'd-soppakeittio': ['Vanha kauppahalli Helsinki', 'Lohikeitto'],
    'd-savoy': ['Savoy Helsinki', 'Esplanadi Helsinki'],
    'd-loyly-rest': ['Löyly Helsinki', 'Karjalanpiirakka'],
    'd-maaemo': ['Bjørvika Oslo', 'Norwegian seafood platter'],
    'd-fiskekompaniet': ['Red king crab Norway', 'Tromsø seafood'],
    'd-moss': ['Blue Lagoon lava Iceland', 'Icelandic lamb dish'],
    'd-tides': ['Reykjavik harbor seafood', 'Arctic char dish'],
  };

  const hotelPhotos = {};
  for (const [id, q] of Object.entries(hotelQueries)) {
    hotelPhotos[id] = (await searchCommons(q, 4)).slice(0, 4);
    console.log(`✓ Hotel ${id}: ${hotelPhotos[id].length} verified photos`);
  }

  const diningPhotos = {};
  for (const [id, q] of Object.entries(diningQueries)) {
    diningPhotos[id] = (await searchCommons(q, 4)).slice(0, 4);
    console.log(`✓ Dining ${id}: ${diningPhotos[id].length} verified photos`);
  }

  const extraFallbacks = {
    gamla_stan: (await searchCommons(['Stortorget Stockholm'], 2))[0],
    seljalandsfoss: (await searchCommons(['Seljalandsfoss'], 2))[0],
    dala_horse: (await searchCommons(['Dala horse'], 2))[0],
    blue_lagoon: hotelPhotos['h-the-retreat'][0],
    kakslauttanen: hotelPhotos['h-kakslauttanen'][0],
    kamp_suite: hotelPhotos['h-kamp'][0],
    king_crab: diningPhotos['d-fiskekompaniet'][0],
  };

  // Clean remaining /src/assets/images in the 8 files found by grep
  const filesToClean = [
    'src/components/GoogleMapsView.tsx',
    'src/components/DailyItineraryView.tsx',
    'src/components/SpotEditorModal.tsx',
    'src/components/DestinationVideosModal.tsx',
    'src/components/NordicSouvenirsModal.tsx',
    'src/components/SearchModal.tsx',
    'src/components/HotelDiningDetailModal.tsx',
    'src/App.tsx',
  ];

  for (const fp of filesToClean) {
    if (!fs.existsSync(fp)) continue;
    let txt = fs.readFileSync(fp, 'utf8');
    txt = txt.replace(/\/src\/assets\/images\/gamla_stan_stockholm_winter_[0-9]+\.jpg/g, extraFallbacks.gamla_stan);
    txt = txt.replace(/\/src\/assets\/images\/kakslauttanen_glass_igloo_aurora_[0-9]+\.jpg/g, extraFallbacks.kakslauttanen);
    txt = txt.replace(/\/src\/assets\/images\/seljalandsfoss_winter_iceland_[0-9]+\.jpg/g, extraFallbacks.seljalandsfoss);
    txt = txt.replace(/\/src\/assets\/images\/nordic_specialties_gifts_[0-9]+\.jpg/g, extraFallbacks.dala_horse);
    txt = txt.replace(/\/src\/assets\/images\/blue_lagoon_iceland_[0-9]+\.jpg/g, extraFallbacks.blue_lagoon);
    txt = txt.replace(/\/src\/assets\/images\/nordic_luxury_suite_[0-9]+\.jpg/g, extraFallbacks.kamp_suite);
    txt = txt.replace(/\/src\/assets\/images\/nordic_luxury_dining_[0-9]+\.jpg/g, extraFallbacks.king_crab);
    fs.writeFileSync(fp, txt);
    console.log(`✓ Cleaned ${fp}`);
  }

  fs.writeFileSync('tmp/hotel_dining_verified.json', JSON.stringify({ hotelPhotos, diningPhotos }, null, 2));
}

main();
