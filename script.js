let input = document.querySelector(".search__input");
let searchList = document.querySelector(".search__autocom")
let selectedList = document.querySelector(".selected__list")


input.addEventListener("keyup", debounce(handleInput, 400))
selectedList.addEventListener("click", removeSelected);


function debounce(fn, debounceTime) {
    let timeout;
    return function () {
        let fnCall = () => { fn.apply(this, arguments) }
        clearTimeout(timeout)
        timeout = setTimeout(fnCall, debounceTime)
    }
};


async function handleInput() {
    let searchText = input.value.trim();
    if (searchText) {
        try {
            const items = await searchRepositories(searchText);
            autocomAdd(items);
        } catch (error) {
            console.error(`Error handling input: ${error.message}`);
        }
    }
}


const searchRepositories = async (searchText) => {
    try {

        const url = `https://api.github.com/search/repositories?q=${searchText}`
        const response = await fetch(url)

        if(!response.ok) {
            throw new Error(`GitHub API request failed: ${response.status}`);
        }
    
        const data = await response.json()
        return data.items

    } catch(error) {
        console.error(`Error during GitHub API request: ${error.message}`);
    }
}


function autocomAdd (items) {
    searchList.innerHTML = ""
    for (let i = 0; i <= 4; i++) {
        const item = items[i];

        const li = document.createElement("li");
        li.classList.add("active");
        li.textContent = `${item.name}`;

        li.addEventListener("click", function() {
            addToSelectedList(item.name, item.owner.login, item.stargazers_count)
        })

        searchList.appendChild(li);
    }
}



function addToSelectedList (itemName, itemOwner, itemStars) {

    const selectedItem = document.createElement("li");
    selectedItem.classList.add("selected__item")

    selectedItem.insertAdjacentHTML("beforeend"  ,`Name: ${itemName}<br>Owner: ${itemOwner}<br>Stars: ${itemStars}`);

    const button = document.createElement("button");
    button.classList.add("button__x")

    selectedList.appendChild(selectedItem)
    selectedItem.appendChild(button)

    input.value = "";
    searchList.innerHTML = ""

}



function removeSelected(event) {
    if(event.target.classList.contains("button__x")) {
        let itemForDelete = event.target.parentElement
        itemForDelete.removeEventListener("click", addToSelectedList)
        itemForDelete.remove()
    }

}
