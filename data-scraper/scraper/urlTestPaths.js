export const urlPaths = [
    {
	    name: "zara",
	    url: "https://www.zara.com",
	    queries: {
	    	women: "/bg/bg/damsko-rokli-l1066.html?v1=2287785",
	    	men: "bg/bg/mazhko-novo-l711.html?v1=2204415"
	    },
        target: {
            tag: "div", 
            class: "product-grid-product-info",
            metadata: {
                link: "product-link _item product-grid-product-info__name link",
                price: ["product-grid-product-info__product-price price", "money-amount__main"],
                name: "h3" 
            }
        }
    },
    {
        name: "abaoutyou",
        url: "https://www.aboutyou.bg",
        queries: {
            women: "/zheni/drexi-20204",
            men: "/c/mazhe/drexi-20290"
        }
    },
    {
        name: "catsapi",
        url: "https://cataas.com",
        queries: {
            htmlCat: "/cat?html=true"
        }
    }
]

export const proxyList = [
    {
        protocol: "http",
        host: "50.168.10.174",
        port: 80
    },
	{
        protocol: "http",
        host: "50.168.10.175",
        port: 80
    },
	{
        protocol: "http",
        host: "50.168.10.170",
        port: 80
    },
	{
        protocol: "http",
        host: "50.168.10.178",
        port: 80
    },
	{
        protocol: "http",
        host: "50.171.32.228",
        port: 80
    },
	{
        protocol: "http",
        host: "89.187.179.179",
        port: 8443
    },
	{
        protocol: "http",
        host: "51.254.121.123",
        port: 8088
    },
	{
        protocol: "SOCKS5",
        host: "74.119.144.60",
        port: 4145
    },
	{
        protocol: "SOCKS5",
        host: "199.58.185.9",
        port: 4145
    }
]