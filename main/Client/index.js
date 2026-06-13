let userdata = {
    days: null,
    months:[],
    categories:[],
    selectDates:[],
    selectCalD:null,
    session: false,
    recommId:'575647655',
    currentPage:'mainPage',
    startMonth: null,
    sessionToken : null,
    savedPackingLists: {},
    savedDayPlanners: {},
    savedRecommIds: [],
    deleteSavedId: [],
    tripData: {},
};
window.addEventListener('load', () => {
    // getSession();
    let savedData = localStorage.getItem('when2go_data');
    if (savedData) {
        userdata = JSON.parse(savedData);
    }
    sessionBtns();
    userdata.selectCalD=null;
    if(userdata.currentPage==='finPage'){
        if(userdata.recommId){
        generateCalendar();
        fillSavedPackLi();
        const finPTitle = document.getElementById('finPageTitle');
        if (finPTitle && userdata.tripData[userdata.recommId]) {
        finPTitle.textContent = userdata.tripData[userdata.recommId].Location;
        }
        }else{
            userdata.currentPage ='mainPage'
             window.location.reload();
        }
    }
    if(userdata.currentPage==='chPage3'){
        if(userdata.recommId){
        getRecomms();
        }
    }
    fillInSaved();
    const views = ['mainPage', 'chPage1', 'chPage2', 'chPage3', 'finPage'];
    views.forEach(view => {
        const el = document.getElementById(view);
        if (el) el.classList.add('hidden');
    });
    document.getElementById(`${userdata.currentPage}`).classList.remove('hidden');
});
function sessionBtns(){
    if (userdata.session === true) {
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('accountBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    }else{
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    document.getElementById('accountBtn').classList.add('hidden');
    }
}
function fillInSaved(){
    const months = userdata.months;
    const categories = userdata.categories;
    if(months.length>0){
        for(const month of months){
            const monthElement = document.getElementById(month)
            toggleSelected(monthElement)
        }
    }   
    if(categories.length>0){
        for(const category of categories){
            const catElement = document.getElementById(category)
            toggleSelected(catElement)
        }
    }
}
const monthMap = {
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
    "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
};
const monthNameMap = {
    "Jan": 'January', "Feb": 'February', "Mar": 'March', "Apr": 'April', "May": 'May', "Jun": 'June',
    "Jul": 'July', "Aug": 'August', "Sep": 'September', "Oct": 'October', "Nov": 'November', "Dec": 'December'
};
const reverseMonthMap = Object.fromEntries(
    Object.entries(monthMap).map(([name, num]) => [num, name])
);
function saveUsrData(){
    localStorage.setItem('when2go_data', JSON.stringify(userdata));
}
function logoutUsr(){
    userdata.currentPage='mainPage'
    userdata.session = false;
    userdata.days=0;
    userdata.months=[];
    userdata.categories=[];
    userdata.selectDates=[];
    userdata.selectCalD=0;
    userdata.recommId=null;
    userdata.startMonth= null,
    userdata.sessionToken = null,
    userdata.savedPackingLists= {},
    userdata.savedDayPlanners={},
    userdata.savedRecommIds= [],
    userdata.tripData={},
    sessionBtns();
    saveUsrData();
    window.location.reload();
}
function multiChoice(choice, element, type){
    let data= null;
    switch (type){
        case 'cat':
            data = userdata.categories
            break;
        case 'month':
            data = userdata.months
            break;
    }
    if(!data.includes(choice)){
        data.push(choice)
        toggleSelected(element)
    }else {
        if(data===userdata.categories){
          userdata.categories = data.filter(c => c !== choice)  
        }else if (data===userdata.months){
          userdata.months = data.filter(c => c !== choice)  
        }
        toggleSelected(element)
    }
}
function toggleSelected(element){
    if(element){
        if (!element.classList.contains('selected')){
            element.classList.add('selected')
        }else{
            element.classList.remove('selected')
        }
    }
    saveUsrData();
}
async function toggleView(currentPage){
    console.log("days"+userdata.days);
    console.log("months"+userdata.months.length);
    console.log("category"+userdata.categories.length);
    console.log("saved"+userdata.savedRecommIds.length);
    console.log("session"+userdata.session);
    
    switch(currentPage){
        case 'start':
            userdata.days=document.getElementById('search').value
            if(userdata.days>0){
            userdata.currentPage='chPage1';
            document.getElementById('mainPage').classList.add('hidden');
            document.getElementById('chPage1').classList.remove('hidden');}
            break;
        case 'timeframe':
            if(userdata.months.length!==0){
                userdata.currentPage='chPage2';
            document.getElementById('chPage1').classList.add('hidden');
            document.getElementById('chPage2').classList.remove('hidden');}
            break;
        case 'vacType':
            if(userdata.categories.length!==0){
                userdata.currentPage='chPage3';
            document.getElementById('chPage2').classList.add('hidden');
            document.getElementById('chPage3').classList.remove('hidden');
            getRecomms();
        }
            break;
        case 'recomms':
            findCheckedRecomms();
            if(userdata.session || document.getElementById('loginQuest').open || !userdata.savedRecommIds.length==1){
                if(document.getElementsByClassName('recommPick selected').length>0){
                    userdata.currentPage='finPage';
                    await getTripData(userdata.recommId);
                    loadInTripData(userdata.recommId);
                    generateCalendar();
                    fillSavedPackLi();
                    const finPTitle = document.getElementById('finPageTitle');
                    if (finPTitle && userdata.tripData[userdata.recommId]) {
                        finPTitle.textContent = `Your Trip to ${userdata.tripData[userdata.recommId].Location} in ${monthNameMap[userdata.startMonth]}`;
                    }
                    document.getElementById('chPage3').classList.add('hidden');
                    document.getElementById('finPage').classList.remove('hidden');
                    sendSavedTrips();
                }
            }else if (!userdata.session && userdata.savedRecommIds.filter(id => id !== userdata.recommId)) {
                document.getElementById('loginQuest').showModal();
            }
            
            break;
        case 'timeframeBack':
            userdata.currentPage='mainPage';
            document.getElementById('chPage1').classList.add('hidden');
            document.getElementById('mainPage').classList.remove('hidden');
            break;
        case 'vacTypeBack':
            userdata.currentPage='chPage1';
            document.getElementById('chPage2').classList.add('hidden');
            document.getElementById('chPage1').classList.remove('hidden');
            break;
        case 'recommsBack':
            userdata.currentPage='chPage2';
            document.getElementById('chPage3').classList.add('hidden');
            document.getElementById('chPage2').classList.remove('hidden');
            break;
        case 'finalViewBack':
            userdata.currentPage='chPage3';
            getRecomms();
            document.getElementById('finPage').classList.add('hidden');
            document.getElementById('chPage3').classList.remove('hidden');
    }
    saveUsrData();
    console.log("current page"+userdata.currentPage);

}
function generateCalendar(specMonth) {
    let month=null;
    if(!specMonth){
        userdata.startMonth = userdata.months
        
        month = userdata.startMonth
    }else {
        month=specMonth;
    }
    const container = document.getElementById('calendarGrid');
    container.innerHTML = `
        <div class="calDay-card-Title"><p>Mon</p></div>
        <div class="calDay-card-Title"><p>Tue</p></div>
        <div class="calDay-card-Title"><p>Wed</p></div>
        <div class="calDay-card-Title"><p>Thu</p></div>
        <div class="calDay-card-Title"><p>Fri</p></div>
        <div class="calDay-card-Title"><p>Sat</p></div>
        <div class="calDay-card-Title"><p>Sun</p></div>    
    `; 
    document.getElementById('calTitle').innerHTML=`${month}`
    const monthNumber = monthMap[month];
    const firstDay = new Date(2026, monthNumber-1, 0).getDay();
    for (let i = 0; i < firstDay; i++) {
        const card = document.createElement('div');
        card.className = 'calDay-card';
        container.appendChild(card);
    }
    for (let i = 1; i <= getDaysForSelectedMonths(month); i++) {
        const card = document.createElement('div');
        card.className = 'calDay-card';
        card.id=`${i}.${monthMap[month]}`
        card.innerHTML = `
            <button id='${card.id}' class="calDateBtn" onclick='calBtnToggle(this)'>${i}</button>
        `;
        if(userdata.selectDates && userdata.selectDates.includes(card.id)){
            card.classList.add('dateRange')
        }
        container.appendChild(card);
    }
}
function calBtnToggle(element){
    const currentSelect = document.getElementsByClassName('calDateBtn selected')
    if(currentSelect.length===0){
        toggleSelected(element);
    }else {
        toggleSelected(currentSelect[0]);
        toggleSelected(element)
    }
    userdata.selectCalD=element.id;
    saveUsrData();
    const dayPLans = userdata.savedDayPlanners[`${userdata.recommId}_${element.id}`]||[];
    if(dayPLans){
        let listContain = document.getElementById('planLiContain');
        listContain.innerHTML = "";
        for(const plan of dayPLans){
        dayPLanListElement(plan)
        }
    }
}
function fillSavedPackLi(){
    const packList = userdata.savedPackingLists[`${userdata.recommId}`]||[];
    if(packList){
        let listContain = document.getElementById('packListList');
        listContain.innerHTML = "";
        for(const pack of packList){
        packListElement(pack)
        }
    }
}
function dayPLanListElement(text){
    let listContain = document.getElementById('planLiContain');
    const newLi= document.createElement("li");
    newLi.textContent = text
    newLi.className='dayPl'
    newLi.onclick=function(){
        this.classList.toggle('selectedPl');
        checkSelectLi(document.getElementById('deleteBtnPl'))
    }
    listContain.appendChild(newLi);
}
function packListElement(packObj){
    let listContain = document.getElementById('packListList');
    const newLi= document.createElement("li");
    newLi.textContent = packObj.item
    newLi.className='packLi'
    if (packObj.isPacked) {
        newLi.classList.add('checkedItem');
    }
    newLi.onclick = function() {
        packObj.isPacked = !packObj.isPacked;
        this.classList.toggle('checkedItem');
        updatePlanLists();
        saveUsrData();
    };
    newLi.ondblclick = function(e) {
        e.stopPropagation();
        this.classList.toggle('selectedPl');
        checkSelectLi(document.getElementById('deleteBtnPack'))
    }
    listContain.appendChild(newLi);
}
function getDaysForSelectedMonths(month) {
    let results = {};
        const monthNumber = monthMap[month];
        const daysCount = new Date(2026, monthNumber, 0).getDate();
    return daysCount;
}
function calChangeMonth(switchDir){
    let currentMonthNumb = monthMap[userdata.startMonth];
    switch(switchDir){
        case '+':
            if (currentMonthNumb>=12){
                currentMonthNumb = 1
            }else {
                currentMonthNumb++
            }
            break;
        case '-':
            if (currentMonthNumb<=1){
                currentMonthNumb =12
            }else {
                currentMonthNumb--
            }
    }
    userdata.startMonth=reverseMonthMap[currentMonthNumb];
    generateCalendar(userdata.startMonth)
    let listContain = document.getElementById('planLiContain');
        listContain.innerHTML = "";
    saveUsrData();
}
function delLi(element){
    const allSelected = document.querySelectorAll('.selectedPl');

    const currentTrip = userdata.recommId;
    const currentDay = userdata.selectCalD;
    const plannerKey = `${currentTrip}_${currentDay}`;
    for(const e of allSelected){
        const textToRemove = e.textContent; 
        if (e.classList.contains('dayPl')) {
            if (userdata.savedDayPlanners[plannerKey]) {
                userdata.savedDayPlanners[plannerKey] = userdata.savedDayPlanners[plannerKey].filter(
                    task => task !== textToRemove
                );
            }
        } 
        else if (e.classList.contains('packLi')) {
            if (userdata.savedPackingLists[currentTrip]) {
                userdata.savedPackingLists[currentTrip] = userdata.savedPackingLists[currentTrip].filter(
                    item => item.text !== textToRemove
                );
            }
        }
        e.remove();
    }
    checkSelectLi(element);
    updatePlanLists();
    saveUsrData();
}
function checkSelectLi(element){
    let anySelected = 0;
    switch(element.id){
        case 'deleteBtnPl':{
            anySelected = document.querySelectorAll('.dayPl.selectedPl');
            break;
        }
        case 'deleteBtnPack':{
            anySelected = document.querySelectorAll('.packLi.selectedPl');
            break;
        }
    }
    if (anySelected.length > 0) {
        element.classList.remove('hidden');
    }else {
        element.classList.add('hidden');
    }
}
function createLi(choice){
    let formId =0;
    let listContainId =0;
    let liClassName =0;
    let deleteId = 0;
    const currentDay = userdata.selectCalD;
    const currentTrip = userdata.recommId;
    let Id = 0;
    let textIn =0;

    switch(choice){
        case 'plan':{
            formId= 'dayPlanText';
            listContainId = 'planLiContain';
            liClassName ='dayPl'
            deleteId = 'deleteBtnPl'
            textIn = document.getElementById(formId);
            if (!currentDay) {
                alert("Please click a day on the calendar first!");
            return;
            }
            const plannerKey = `${currentTrip}_${currentDay}`
            if (!userdata.savedDayPlanners[plannerKey]) {
                userdata.savedDayPlanners[plannerKey] = [];
            }
            if (textIn.value.trim() !== "") {
                userdata.savedDayPlanners[plannerKey].push(textIn.value);
            }
            dayPLanListElement(textIn.value)
            break;
        }
        case 'pack':{
            formId= 'packText';
            listContainId = 'packListList';
            liClassName ='packLi'
            deleteId = 'deleteBtnPack'
            textIn = document.getElementById(formId);
            if (!userdata.savedPackingLists[currentTrip]) {
                userdata.savedPackingLists[currentTrip] = [];
            }
            if (textIn.value.trim() !== "") {
                userdata.savedPackingLists[currentTrip].push({
                    item: textIn.value.trim(),
                    isPacked: false
                })
            }
            fillSavedPackLi();
            break;
        }
    }
    textIn.value="";
    console.log(JSON.stringify(userdata.savedPackingLists, null, 2));
    console.log(JSON.stringify(userdata.savedDayPlanners, null, 2));
    updatePlanLists();
    saveUsrData();
    
}
function toggleLoginDialog(){
    const login=document.getElementById('loginDialog')
    const signup=document.getElementById('signupDialog')
    if(!login.open && !signup.open){
        closeDialog();
        login.showModal()
    }
    else if(login.open && !signup.open){
        closeDialog();
        signup.showModal();
    }
    else if(!login.open && signup.open){
        closeDialog();
        login.showModal();
    }
}
function closeDialog(){
  const login=document.getElementById('loginDialog')
  const signup=document.getElementById('signupDialog')   
  const account=document.getElementById('accountSavedRecoms')   
  const logQuest=document.getElementById('loginQuest') 
    login.close();
    signup.close();
    account.close();
    logQuest.close();
}
async function toggleRecommsUl(){
    const accountDial = document.getElementById('accountSavedRecoms')
    accountDial.showModal()
    const list = document.getElementById('recommsList')
    if(userdata.savedRecommIds){
        list.innerHTML = '';
        for(const recomm of userdata.savedRecommIds){
            if(recomm !==userdata.recommId){
                if (!userdata.tripData[recomm]) {
                    await getTripData(recomm);
                }
                const box = document.createElement('li')
                const dateList = userdata.tripData[recomm].Dates
                const dateRange = `${dateList[0]} - ${dateList[dateList.length-1]}`
                box.id= `toBeDeleted-${recomm}`;
                box.innerHTML = `
                    <div class="saved-trip-details">
                        <div class="saved-location-group">
                            <span class="location-pin-icon">📍</span>
                            <p class="saved-trip-location">${userdata.tripData[recomm].Location}</p> 
                        </div>
                        <p class="saved-trip-dates">${dateRange}</p> 
                    </div>
                    
                    <div class="saved-trip-actions">
                        <button onclick="openSavedTrip(this.id)" id="open-${recomm}" class="btn-trip-action btn-edit">
                            ✏️ Edit
                        </button>
                        <button onclick="deleteSavedTrip(this.id)" id="delete-${recomm}" class="btn-trip-action btn-delete">
                            🗑️ Delete
                        </button>
                    </div>
                `;
                list.append(box);
            }
            
        }
    }
}
function openSavedTrip(id){
    const rawId = id.replace('open-', '')
    loadInTripData(rawId);
    generateCalendar();
    fillSavedPackLi();
    closeDialog();
    document.getElementById(`${userdata.currentPage}`).classList.add('hidden')
    userdata.currentPage = 'finPage';
    document.getElementById(`finPage`).classList.remove('hidden')
}
function loadInTripData(id){
    if(!userdata.savedRecommIds.filter(savedId => savedId===id)){
        userdata.savedRecommIds.push(id);
    }
    const tripData = userdata.tripData[id]
    const startDate = convertDate(tripData.startDate)
    const endDate = convertDate(tripData.endDate)
    const Dates = createDateList(tripData.startDate, tripData.endDate)

    userdata.recommId=id;
    userdata.selectDates = Dates;
    userdata.months = reverseMonthMap[getMonthFromCustomStyle(Dates[0])];
    userdata.savedPackingLists[id] = tripData.packingList
    userdata.savedDayPlanners = tripData.dayPlanner
    saveUsrData();
}
function getMonthFromCustomStyle(customDateString) {
    // If the input is "15.2.", splitting by '.' gives you ["15", "2", ""]
    const parts = customDateString.split('.');
    
    // The month number is at index 1
    const monthNumber = parseInt(parts[1], 10);
    
    return monthNumber;
}
function createDateList(startDateString, endDateString){
    const dates = [];
    // 1. Convert inputs to Date objects
    const current = new Date(startDateString);
    const end = new Date(endDateString);

    // 2. Loop until the current date passes the end date
    while (current <= end) {
        const day = current.getUTCDate();
        const month = current.getUTCMonth() + 1; // Months are 0-indexed
        
        // 3. Format to "DD.M." and push to array
        dates.push(`${day}.${month}.`);

        // 4. Move to the next day
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
}
function getRecomms(){
    // const mockRecommendations = [
    //     {
    //         "ID": "575647655",
    //         "City": "Istanbul",
    //         "Country": "Turkey",
    //         "Pic": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=300&q=80",
    //         "DateRange": "15.07.2026 - 22.07.2026"
    //     },
    //     {
    //         "ID": "984321554",
    //         "City": "Marrakech",
    //         "Country": "Morocco",
    //         "Pic": "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=300&q=80",
    //         "DateRange": "01.08.2026 - 08.08.2026"
    //     },
    //     {
    //         "ID": "223411987",
    //         "City": "Casablanca",
    //         "Country": "Morocco",
    //         "Pic": "https://images.unsplash.com/photo-1559586616-3df185a1e6c2?auto=format&fit=crop&w=300&q=80",
    //         "DateRange": "10.08.2026 - 17.08.2026"
    //     }
    // ];
    // const container = document.getElementById('recommendsList');
    // container.innerHTML = "";
    // for(const recomm of mockRecommendations){
    //     const li = document.createElement('li')
    //     li.className = "recomm-item";
    //     li.innerHTML = `
    //         <button type="button" class='recommPick' id="pick-${recomm.ID}" onclick='toggleRecommPick(this)'>
    //             <img src="${recomm.Pic}" alt="${recomm.City}" class="recomm-img">
    //             <div class="recomm-info">
    //                 <strong>${recomm.City}, ${recomm.Country}</strong><br>
    //                 <small>${recomm.DateRange}</small>
    //             </div>
    //         </button>
    //         <div>
    //             <input type="checkbox" class='recommCheck' id="check-${recomm.ID}">
    //         </div>
    //         `;
    //     container.append(li)}

    fetch('http://localhost:3000/api/recommendations/getTripRecommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userdata.sessionToken}`

        },
        body: JSON.stringify({
            tripLength: userdata.days,
            months: userdata.months,
            categories: userdata.categories,
            token: userdata.sessionToken
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('recommendsList');
        container.innerHTML = "";
        for(const recomm of data){
            const li = document.createElement('li')
            li.className = "recomm-item";
            li.innerHTML = `
                <button type="button" class='recommPick' id="pick-${recomm._id}" onclick='toggleRecommPick(this)'>
                    <img src="${recomm.imageUrl}" alt="${recomm.destination}" class="recomm-img">
                    <div class="recomm-info">
                        <strong>${recomm.destination}</strong><br>
                        <small>${convertDate(recomm.startDate)} - ${convertDate(recomm.endDate)}</small>
                    </div>
                </button>
                <div>
                    <input type="checkbox" class='recommCheck' id="check-${recomm._id}">
                </div>
                `;
            container.append(li)}
    })
    .catch(error => {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    });
}
function convertDate(dateString){
    const isoString =dateString;
    const date = new Date(isoString);

    // Use UTC methods to keep the original date intact
    const day = date.getUTCDate();       // Returns 15 (as a number)
    const month = date.getUTCMonth() + 1; // Returns 2 (months are 0-indexed in JS, so +1)

    const formattedDate = `${day}.${month}.`;

    return formattedDate;
}
function toggleRecommPick(element){
    const currentSelect = document.getElementsByClassName('recommPick selected')
    if(currentSelect.length===0){
        toggleSelected(element);
    }else {
        toggleSelected(currentSelect[0]);
        toggleSelected(element)
    }
    userdata.recommId=element.id.replace('pick-', '');
    saveUsrData();
}
async function getTripData(ID){
    // const mockDataPackage = {
    //     "id": ID, // Dynamically use whatever ID was requested
    //     "Location": "Istanbul, Turkey",
    //     "Months": ["Jul"],
    //     "Dates": ["15.7", "16.7", "17.7", "18.7", "19.7", "20.7", "21.7", "22.7"],
    //     "PackList": {
    //         [`${ID}`]: [
    //             { "text": "Passport", "checked": true },
    //                 { "text": "Sunscreen", "checked": false },
    //                 { "text": "Comfortable Walking Shoes", "checked": false }
    //             ]
    //         },
    //     "DayPLanners": {
    //         [`${ID}_15.7`]: [
    //             "Arrive at Istanbul Airport",
    //             "Check into hotel in Beyoğlu",
    //             "Dinner near Galata Tower"
    //         ],
    //         [`${ID}_16.7`]: [
    //             "Morning walk through Sultanahmet",
    //             "Visit Hagia Sophia",
    //             "Bosphorus Sunset Cruise"
    //         ]
    //     }
    // };
    // userdata.tripData[ID]=mockDataPackage;
    // saveUsrData();
    let URL = `http://localhost:3000/api/trips/${ID}`
    return fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userdata.sessionToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const dataId = data.data._id;
        userdata.tripData[dataId]=data.data;
        saveUsrData();
        return true;
    })
    .catch(error => {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    });
}
async function deleteSavedTrip(ID){
    // const rawId = ID.replace('delete-', '')
    // userdata.savedRecommIds = userdata.savedRecommIds.filter(id => id !== rawId)
    const rawId = ID.replace('delete-', '')
    let URL = `http://localhost:3000/api/trips/${rawId}`
    fetch(URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userdata.sessionToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }else if (response.ok) {
            userdata.savedRecommIds = userdata.savedRecommIds.filter(id => id !== rawId)
            saveUsrData()
            const deletedElement = document.getElementById(`toBeDeleted-${rawId}`)
            deletedElement.remove();
        }
        
        return response.json();
    })
    .then(data => {
        return;
    })
    .catch(error => {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    });
}
function updatePlanLists(){
    fetch(`http://localhost:3000/api/trips/${userdata.recommId}/packinglist`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userdata.sessionToken}`
        },
        body: JSON.stringify({
            packingList: userdata.savedPackingLists,
            dayPlanners: userdata.savedDayPlanners,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        return true;
    })
    .catch(error => {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    });
}
function sendSavedTrips(){
    fetch(`http://localhost:3000/api/trips/deleteTrips`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userdata.sessionToken}`
        },
        body: JSON.stringify({
            deleteTrips: userdata.deleteSavedId,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        userdata.savedRecommIds = []
        for(const trip of data){
            userdata.savedRecommIds.push(trip)
        }
        return true;
    })
    .catch(error => {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    });
}
function getSession(){
    fetch(`http://localhost:3000/session`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userdata.sessionToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            logoutUsr();
            return true;
        }
        else if (response.ok) {
            sendSavedTrips();
            return true;
        }
        return response.json();
    })
    .catch(error => {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    });
}
function findCheckedRecomms(){
    const items = document.querySelectorAll('.recommCheck')
    items.forEach(item => {
        const rawId = item.id.replace('check-', '');
        if(item.checked && !userdata.savedRecommIds.includes(rawId)){
            userdata.savedRecommIds.push(rawId);
            userdata.deleteSavedId = userdata.deleteSavedId.filter(id => id !== rawId);
        } 
        else if(!item.checked && userdata.savedRecommIds.includes(rawId)){
            userdata.savedRecommIds = userdata.savedRecommIds.filter(id => id !== rawId);
            if (rawId !== userdata.recommId && !userdata.deleteSavedId.includes(rawId)) {
                userdata.deleteSavedId.push(rawId);
            }
        }
    })
    saveUsrData();
}
async function login(event) {
    if (event) event.preventDefault();
    console.log('login')
    //getting value from the inputs
    const email = document.getElementById('logUsername').value;
    const password = document.getElementById('logPassword').value;

    //checking if data is valid
    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    //sending data to backend
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password})
        });

        const data = await response.json();

        if (data.success) {
            alert("Logged in successfully."+ data.token)
            userdata.session = true;
            userdata.sessionToken=data.token; //saving token to browsers local storage
            sessionBtns();
            closeDialog(); //redirecting user to homepage
            sendSavedTrips();
            saveUsrData();
        }   else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    }
}
async function register(event) {
    if (event) event.preventDefault();
    // getting values from inputs
    const email = document.getElementById('signUsername').value;
    const password = document.getElementById('signPassword').value;
    const passwordRepeat = document.getElementById('repeatSignPassword').value;

    //checking if information is valid
    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== passwordRepeat) {
        alert("Passwords do not match");
        return;
    }

    //sending data to backend
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email, password: password})
        });

        const data = await response.json();

        if (data.success) {
            alert("Account created.");
            userdata.session = true;
            userdata.sessionToken=data.token; //saving token to browsers local storage
            sessionBtns();
            closeDialog(); //redirecting user to homepage
            sendSavedTrips();
            saveUsrData();
        }   else {
            alert("Error: " + data.message);
        }
    }   catch (error) {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    }
}