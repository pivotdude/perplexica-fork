import { searchSearxng } from '@/lib/searxng';

interface WebsiteConfig {
  [language: string]: string[];
}

const websiteConfig: WebsiteConfig = {
  en: [
    'yahoo.com',
    'www.exchangewire.com',
    'businessinsider.com',
    'wired.com',
    'mashable.com',
    'theverge.com',
    'gizmodo.com',
    'cnet.com',
    'venturebeat.com',
    'techcrunch.com',
    'arstechnica.com',
    'thenextweb.com',
    'engadget.com',
  ],
  ru: [
    'ria.ru',
    'tass.ru',
    'vedomosti.ru',
    'rbc.ru',
    'kommersant.ru',
    'iz.ru',
    'lenta.ru',
    'gazeta.ru',
    'vc.ru',
    'habr.com',
  ],
  de: [
    'heise.de',
    'computerbild.de',
    'golem.de',
    'spiegel.de',
    'sueddeutsche.de',
    'welt.de',
  ],
  fr: ['lemonde.fr', 'lefigaro.fr', 'lesechos.fr', '01net.com'],
  es: [
    'elpais.com',
    'elmundo.es',
    'abc.es',
    'xataka.com',
  ],
};

const defaultTopics = [
  'AI',
  'tech',
  'blockchain',
  'cybersecurity',
  'startups',
  'cloud computing',
];

interface Params {
  searchParams: {
    lang?: string;
    topics?: string;
  };
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  console.log(searchParams)

  try {
    const lang = searchParams.get('lang') || 'ru';
    const topicsParam = searchParams.get('topics') || '';
    const topics = topicsParam ? topicsParam.split(',') : defaultTopics;

    const articleWebsites = websiteConfig[lang] || websiteConfig['en'];

    const data = (
      await Promise.all(
        new Array(articleWebsites.length * topics.length)
          .fill(0)
          .map(async (_, i) => {
            const search = `site:${articleWebsites[i % articleWebsites.length]} ${
              topics[i % topics.length]
            }`;

            const options = {
              engines: ['bing news'],
              pageno: 1,
              language: lang,
            };

            const result = await searchSearxng(search, options);

            if (result && result.results && Array.isArray(result.results)) {
              return result.results;
            } else {
              console.warn(`No results found for search: ${search}`);
              return [];
            }
          })
      )
    ).flat();

    console.log('data', data);

    return Response.json(
      {
        blogs: data,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(`An error occurred in discover route: ${err}`);
    return Response.json(
      {
        message: 'An error has occurred',
      },
      {
        status: 500,
      }
    );
  }
};