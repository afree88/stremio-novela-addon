const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const catalog = require("./catalog.json");

const builder = new addonBuilder({
    id: "org.Filmes.catalog",
    version: "0.0.1",
    name: "novalas Catalog",
    description: "Novelas Clássicas",
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    catalogs: [
        {
            type: "movie",
            id: "Filmes",
            name: "Filmes",
            extra: [
                { name: "search", isRequired: false },
                {
                    name: "genre",
                    isRequired: false,
                    options: ["Mazzaropi", "100 Melhores Animações Brasileiras - ABRACCINE", "Desenhos", "Comédia", "Drama", "Romance", "Aventura", "Suspense", "Terror", "Documentário"]
                }
            ]
        },
        {
            type: "series",
            id: "novelas",
            name: "Novelas Clássicas",
            extra: [
                { name: "search", isRequired: false },
                {
                    name: "genre",
                    isRequired: false,
                    options: ["100 Melhores Animações Brasileiras - ABRACCINE", "100 Melhores Curta Metragens", "Desenhos", "Drama", "Comédia", "Romance", "Época", "Suspense", "Policial", "Mistério"]
                }
            ]
        }
    ]
});

builder.defineCatalogHandler(({ type, id, extra }) => {
    console.log("request for catalog: " + type + " " + id);
    let results = catalog;

    // Filter by type and id logic (simplified to just filter by type for now as base)
    if (type === "movie" && id === "Filmes") {
        results = results.filter(i => i.type === "movie");
    } else if (type === "series" && id === "novelas") {
        results = results.filter(i => i.type === "series");
    } else {
        return Promise.resolve({ metas: [] });
    }

    // Filter by genre if present
    if (extra && extra.genre) {
        results = results.filter(item => item.genres && item.genres.includes(extra.genre));
    }

    // Filter by search if present
    if (extra && extra.search) {
        results = results.filter(item => item.name.toLowerCase().includes(extra.search.toLowerCase()));
    }

    return Promise.resolve({ metas: results });
});

builder.defineMetaHandler(({ type, id }) => {
    console.log("request for meta: " + type + " " + id);
    const movie = catalog.find(m => m.id === id);
    return Promise.resolve({ meta: movie || null });
});

serveHTTP(builder.getInterface(), { port: 7000 });
