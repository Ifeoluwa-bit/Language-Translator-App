const selectTag = document.querySelectorAll("select"),
fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
translateBtn = document.querySelector("button"),
exchangeIcon = document.querySelector(".exchange"),
icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
    for(let country_code in countries){
        let selected;
        //selecting English by default as FROM language and Hausa as TO Language
        if(id == 0 && country_code == "en-GB"){
            selected = "selected";
        }else if(id == 1 && country_code == "ha-NE"){
            selected = "selected";
        }
        let option = `<option  value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    
        //let option = `<option value="${countries}>${countries[country_code]}</option>`;
        //tag.insertAdjacentHTML("beforeend", option);// adding option tag insidew select tag
    }
});

exchangeIcon.addEventListener("click", () => {
    //exchanging textarea and select tag values
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});


translateBtn.addEventListener("click", () => {
    let text = fromText.value,
    translateFrom = selectTag[0].value, //getting fromselect tag value
    translateTo = selectTag[1].value; // getting toselect tag value
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}&de=olaniyant65@gmail.com`;
    //fetching api response and returning it with parsing into js obj
    //and in another then method receiving that obj
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target})=>{
        //if click icon has from id, copy the fromTextArea Value, else copy the toTextArea Value
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            }else {
                navigator.clipboard.writeText(toText.value);
            }
        }else{
            //if click icon has from id, speak the fromTextArea Value, else speak the toTextArea Value
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value //setting utterance lang to fromSelect tag value
            }else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value //setting utterance lang to toSelect tag value
            }
            speechSynthesis.speak(utterance); //speak the passed utterance
        }
    });
})