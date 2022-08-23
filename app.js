console.log("App is running...")




let moreJobsBtn = document.getElementsByClassName("m-loadMoreJobsButton__button")
let btn = moreJobsBtn[0];
console.log(btn);
btn.addEventListener("click", delayRateCompanys);

function delayRateCompanys () {
    delay().then(rateCompanys);
}

function delay () {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

function rateCompanys () {

    let elements = document.getElementsByClassName("m-jobsListItem__companyName m-jobsListItem__companyName--link");
    let companys = [];

    for (let i = 0; i < elements.length; i++) {
        companys.push(elements[i].textContent)
    }

    console.log(companys);

    companys.forEach(company => {
        const fetchLink = async () => {
            try {
                let companyString = company.replaceAll(/ /g, "+");
                //console.log('fetch link: ' , `https://www.kununu.com/de/search#/?q=${companyString}`);
                let link = `https://www.kununu.com/de/search?q=${companyString}&country=at`;
                const response = await axios.get(link);
                //const response = await axios.get(`https://www.kununu.com/de/search#/?q=${company}&country=COUNTRY_AT`);

                const html = response.data;

                var match = /<div class="_score_t2sad_64"><span class="h5">/.exec(html);
                if (match != null) {
                    console.log("Char:", html.slice(match.index + 46, match.index + 49))
                    let rating = html.slice(match.index + 46, match.index + 49);

                    // display Ratings
                    var elements = getElementByCompany(company)
                    console.log("Elements: ", elements);
                    Array.from(elements).forEach(element => {
                        writeRatings(element, rating, link);
                    })
                } else {
                    console.log("No Match!")
                }

            } catch (error) {
                throw error;
            }
        };
        console.log(fetchLink());
    })
}

function getElementByCompany (company) {
    let elements = document.getElementsByClassName("m-jobsListItem__companyName m-jobsListItem__companyName--link");
    let elementMatches = [];
    Array.from(elements).forEach(element => {
        if (element.textContent === company) {
            elementMatches.push(element)
        }
    })
    return elementMatches;
}

function writeRatings (element, rating, link) {


        let parent = element.parentElement.parentElement.parentElement.previousElementSibling;
        console.log(parent.childNodes.length)
        let wasWritten = false;
        Array.from(parent.children).forEach(node => {
            console.log("Node: ", node);
            if (node.classList.contains("rating")) wasWritten = true;
        })

        if (!wasWritten) {
            var tag = document.createElement("p");
            tag.classList.add("rating")
            tag.style.textAlign = "center";
            tag.style.fontWeight = "bold";
            var text = document.createTextNode(rating);
            tag.appendChild(text);
            parent.appendChild(tag);

            let kunufu = document.createElement("a");
            var text = document.createTextNode("Kunufu");
            kunufu.appendChild(text);
            kunufu.href = link;
            parent.appendChild(kunufu);

            // var img = document.createElement("img");
            // img.src = "/assets/Star-icon.png";
            // img.width = "100%";
            // parent.appendChild(img);
        }
}

rateCompanys();