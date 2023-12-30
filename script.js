const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen  = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector('.error-container');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');


//variables needed

let currentTab = userTab;
const apikey = "14836a042e4544b98f823938230611";
currentTab.classList.add("currentTab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("currentTab");
        currentTab = clickedTab;
        currentTab.classList.add("currentTab");

        if(!searchForm.classList.contains("active")){
            //kya search form vala container is invisible,if yes then make it visible.
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            notFound.classList.remove("active");
        }
        else{
            //main phle search vale tab pe tha ab mujhe weather wale per switch karna he
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFound.classList.remove("active");

            //ab me weather tab me agaya hu,toh weather bhi display karna padega.so let's check local storage first for coordinates if we have saved there.
            getfromSessionStorage();
        }
    }


}

//checks if coordinates are already present in session sstorage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        //agar local coordinates nhi mel to hame grant location vala container dikhana padhega.
        grantAccessContainer.classList.add("active");
    }
    else{
        let coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


 async function fetchUserWeatherInfo(coordinates){
       const {lat,long} = coordinates;
       //make grant access container invisible
       grantAccessContainer.classList.remove("active");
       //make loader visible
       loadingScreen.classList.add("active");

       //api call
       try{

        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${long,lat}`);
        const data = await response.json();   
           
        //removes loader now
        loadingScreen.classList.remove("active");
        // show weather of the user's place where he resides.
        userInfoContainer.classList.add("active");
        
        // hame function call kiya jisse hame UI per show sake hamara weather jo abhi data ke ander store he
        renderWeatherInfo(data);
       }
       catch(err){
        console.log("Your weather error"+ err);
          loadingScreen.classList.remove("active");
          notFound.classList.add('active');
          errorImage.style.display = 'none';
          errorText.innerText = `Error: ${err?.message}`;
          errorBtn.style.display = 'block';
          errorBtn.addEventListener("click", fetchUserWeatherInfo);
          
       }
}


function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
   // fetch values from weatherInfo and put it in UI
   cityName.innerText = weatherInfo?.location?.name;
//    let countryName = weatherInfo?.location?.country;
//    console.log(countryName);
   countryIcon.src =`https://flagcdn.com/144x108/in.png`;
//    `https://flagcdn.com/144x108/${weatherInfo?.location?.country.toLowerCase()}.png`;
    // `https://flagcdn.com/144x108/in.png`;
   
   desc.innerText = weatherInfo?.current?.condition?.text;
   weatherIcon.src = `https:${weatherInfo?.current?.condition?.icon}`;
   temp.innerText = `${weatherInfo?.current?.temp_c} °C`;
   windspeed.innerText = `${weatherInfo?.current?.wind_mph} m/h`;
   humidity.innerText = `${weatherInfo?.current?.humidity} % `;
   cloudiness.innerText = `${weatherInfo?.current?.cloud} %`;

}

userTab.addEventListener("click",()=>{
    //passed clicked Tab as parameter
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    //passed clicked Tab as parameter
    switchTab(searchTab);
})

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("Error in access location");
        //show alert for no geolocation found
    }
}


function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        long : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAcess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
        // cityName.value="";
    }
});


async function fetchSearchWeatherInfo(city){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    
    try{ 
        loadingScreen.classList.add("active");
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`);
       const data = await response.json();

       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);
       
    }
    catch(err){
          console.log("Search error "+ err);
          loadingScreen.classList.remove('active');
          userInfoContainer.classList.remove('active');
          notFound.classList.add('active');
          errorText.innerText = `${err?.message}`;
          errorBtn.classList.add('active');
          errorBtn.addEventListener("click", fetchSearchWeatherInfo);
    }
}














// console.log("Hello Shabbir");

// const apikey1 = "14836a042e4544b98f823938230611";
// // http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London


// function renderWeatherInfo(data){
     
//         let newPara = document.createElement('p');
//         newPara.textContent = `${data.current.temp_c}`;
//         document.body.appendChild(newPara);
// }
// async function fetchWeatherDetails(){
//     try{
//         let city = "Goa";
//         const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`);
//         const data = await response.json();
//         console.log(data);

//         renderWeatherInfo(data);
//     }
//     catch(error){
//        // handle error
//     }

// }

// async function getCustomWeatherDetails(){
//     try{
//         let longitude = 23.0302;    //2.3508;
//         let latitude =   72.5772; //48.8567;
    
//         const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${longitude,latitude}`);
//         const data = await response.json();
//         console.log(data);
//     }
//     catch(error){

//     }
   
// }

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("Geolocation not supported in browser.");
//     }
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let lon = position.coords.longitude;
//     console.log(lat);
//     console.log(lon);
// }

// getCustomWeatherDetails();
// fetchWeatherDetails();