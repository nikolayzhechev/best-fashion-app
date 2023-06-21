const urlPaths = [
    {
	    name: "zara",
	    url: "https://www.zara.com",
	    queries: {
	    	women: "/bg/bg/damsko-rokli-l1066.html?v1=2287785",
	    	men: "bg/bg/mazhko-novo-l711.html?v1=2204415"
	    }
    },
]

export function urlData (siteName, type) {
    let site = urlPaths.filter(el => el.name === siteName.toLowerCase())[0];

    if (type === "woman"){
        return site.url + site.queries.women;
    } else {
        return site.url + site.men;
    }
}