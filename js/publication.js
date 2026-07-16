console.log('Nouveau publi.js')

let publications = [];

// fetch("../publis_SPASCIA.xlsx")
//     .then(response => {
//         console.log(response.status);
//         console.log(response.headers.get("content-type"));
//         return response.arrayBuffer();
//     })
//     .then(data => {
//         console.log(data.byteLength);
//     });

fetch("../publis_SPASCIA.xlsx")
    .then(response => response.arrayBuffer())
    .then(data => {

        const workbook = XLSX.read(data, {
            type: "array"
        });

        // Première feuille du classeur
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Conversion en tableau d'objets
        publications = XLSX.utils.sheet_to_json(sheet);

        // Trie du plus récent au plus ancien
        publications.sort((a, b) => b.Year - a.Year);

        initializeFilters();
        display(publications);

    })
    .catch(error => {

        console.error(error);

        document.getElementById("publications").innerHTML =
            "<p>Impossible de charger les publications.</p>";

    });


function initializeFilters(){

    const years = [...new Set(publications.map(p=>p.Year))]
        .sort((a,b)=>b-a);

    const yearSelect = document.getElementById("yearFilter");

    years.forEach(year=>{

        let option=document.createElement("option");

        option.value=year;
        option.textContent=year;

        yearSelect.appendChild(option);

    });


    const types=[...new Set(publications.map(p=>p.Type))];

    const typeSelect=document.getElementById("typeFilter");

    types.forEach(type=>{

        let option=document.createElement("option");

        option.value=type;
        option.textContent=type;

        typeSelect.appendChild(option);

    });

}


document.getElementById("search").addEventListener("input",filter);

document.getElementById("yearFilter").addEventListener("change",filter);

document.getElementById("typeFilter").addEventListener("change",filter);


function filter(){

    const search=document.getElementById("search").value.toLowerCase();

    const year=document.getElementById("yearFilter").value;

    const type=document.getElementById("typeFilter").value;


    const filtered=publications.filter(pub=>{

        const text=JSON.stringify(pub).toLowerCase();

        return (
            text.includes(search)
            &&
            (year==="" || pub.Year===year)
            &&
            (type==="" || pub.Type===type)
        );

    });

    display(filtered);

}


function display(list){

    document.getElementById("publication-count").innerHTML=
        list.length+" publication(s)";

    const container=document.getElementById("publications");

    container.innerHTML="";

    const grouped={};

    list.forEach(pub=>{

        if(!grouped[pub.Year])
            grouped[pub.Year]=[];

        grouped[pub.Year].push(pub);

    });

    Object.keys(grouped)
        .sort((a,b)=>b-a)
        .forEach(year=>{

            const title=document.createElement("div");

            title.className="year-title";

            title.innerHTML=year;

            container.appendChild(title);

            grouped[year].forEach(pub=>{

                const div=document.createElement("div");

                div.className="publication";

                const doi=pub.DOI
                    ? `<a href="https://doi.org/${pub.DOI}" target="_blank">${pub.DOI}</a>`
                    : "";

                div.innerHTML=`

                    <h3>${pub.Title}</h3>

                    <div class="meta">

                        ${pub.Type}
                        •
                        <i>${pub.Journal}</i>

                    </div>

                    <div class="authors">

                        ${pub.Authors}

                    </div>

                    <div class="spascia">

                        SPASCIA Authors :
                        ${pub["SPASCIA Authors"]}

                    </div>

                    <p>

                        DOI :
                        ${doi}

                    </p>

                    <p>

                        Citations :
                        ${pub.Citations}

                    </p>

                `;

                container.appendChild(div);

            });

        });

}