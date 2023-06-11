const urlPaths = [
    {
	    name: "zara",
	    url: "https://www.zara.com",
	    queries: {
	    	women: "/bg/bg/damsko-novo-l1180.html?v1=2184058",
	    	men: "bg/bg/mazhko-novo-l711.html?v1=2204415"
	    }
    },
]

export function urlData (siteName, type) {
    let site = urlPaths.filter(el => el.name === siteName.toLowerCase());

    if (type === "woman"){
        return site.url + site.women;
    } else {
        return site.url + site.men;
    }
}