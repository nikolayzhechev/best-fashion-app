export const urlPaths = [
    {
	    name: "zara",
	    url: "https://www.zara.com",
	    queries: {  // < type
	    	woman: "/bg/bg/damsko-rokli-l1066.html?v1=2287785",
	    	men: "/bg/bg/mazhko-novo-l711.html?v1=2204415"
	    },
        target: {
            tag: "div", 
            class: "products-category-grid-block--is-template product-grid-block-dynamic product-grid-block-dynamic__container product-grid-block-dynamic__container--1A", //".product-grid-product-info__main-info",
            metadata: {
                link: ".product-link _item product-grid-product-info__name link",
                price: ["product-grid-product-info__product-price price", "money-amount__main"],
                text: "h3"
            },
            img: {
                class: "media-image__image",
                tag: "div",
                refTag: "img"
            }
        }
    },
    {
        name: "abaoutyou",
        url: "https://www.aboutyou.bg",
        queries: {
            woman: "/c/zheni/drexi-20204",
            men: "/c/mazhe/drexi-20290"
        },
        target: {
            tag: "li",
            class: ".sc-oelsaz-0",
            metadata: {
                link: ".sc-16ol3xi-0 sc-163x4qs-0 KQunc hMXgrQ sc-nlxe42-4 cyyDqa",
                price: {
                    class: ".sc-nskkbm-0 byAMio",
                    tag: "span"
                },
                text: {
                    class: ".sc-1vt6vwe-0", //sc-1vt6vwe-1 sc-1qsfqrd-1 jQLlAg uXZUf eGeLkD
                    tag: "p"
                },
                img: {
                    class: "sc-mt3y39-0",
                    parentTag: "div",
                    refTag: "img"
                }
            }
        }
    },
    {
        name: "remixshop",
        url: "https://remixshop.com/bg",
        queries: {
            woman: "/womens-clothes",
            men: "/mens-clothes"
        },
        target: {
            tag: "div",
            class: ".product-box-content",
            metadata: {
                link: ".product-photos",
                price: {
                    class: ".product-detail-info > .product-price > .price new-price",
                    tag: "div"
                },
                text: {
                    class: ".product-photos",
                    tag: "a"
                },
                img: {
                    class: ".img-fluid",
                    parentTag: "a",
                    refTag: "img"
                }
            }
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
    },
    {
        protocol: "HTTP",
        host: "35.236.207.242",
        port: 33333
    },
    {
        protocol: "SOCKS5",
        host: "184.178.172.11",
        port: 4145
    }
]