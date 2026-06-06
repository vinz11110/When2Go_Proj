let userdata = {
    days: null,
    months:[],
    categories:[],
    selectDates:[],
    selectCalD:null,
    session: 'true',
    recommId:null,
    currentPage:'mainPage',
    startMonth: null,
    savedPackingLists: {},
    savedDayPlanners: {},
    savedRecommIds: [],
};
window.addEventListener('load', () => {
    let savedData = localStorage.getItem('when2go_data');
    if (savedData) {
        userdata = JSON.parse(savedData);
    }
    checkState();
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById(`${userdata.currentPage}`).classList.remove('hidden');
    if(userdata.currentPage==='finPage'){
        if(findCheckedRecomms()){
        generateCalendar()
        }
    }
    fillInSaved();
});
function checkState(){
    if (userdata.session === 'true') {
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
const reverseMonthMap = Object.fromEntries(
    Object.entries(monthMap).map(([name, num]) => [num, name])
);
function saveUsrData(){
    localStorage.setItem('when2go_data', JSON.stringify(userdata));
}
function logoutUsr(){
    userdata.currentPage='mainPage'
    userdata.session='false';
    userdata.days=0;
    userdata.months=[];
    userdata.categories=[];
    userdata.selectDates=[];
    userdata.selectCalD=0;
    userdata.recommId=[];
    checkState();
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
        if(data==userdata.categories){
          userdata.categories = data.filter(c => c !== choice)  
        }else if (data==userdata.months){
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
function toggleView(currentPage){
    console.log("days"+userdata.days);
    console.log("months"+userdata.months.length);
    console.log("category"+userdata.categories.length);
    
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
            getRecomms();}
            break;
        case 'recomms':
            if(!findCheckedRecomms()){
            userdata.currentPage='finPage';
            document.getElementById('chPage3').classList.add('hidden');
            document.getElementById('finPage').classList.remove('hidden');
            getTotalDays();
            generateCalendar();}
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
            document.getElementById('finPage').classList.add('hidden');
            document.getElementById('chPage3').classList.remove('hidden');
    }
    saveUsrData();
    console.log("current page"+userdata.currentPage);

}
function generateCalendar(specMonth) {
    let month=null;
    if(!specMonth){
        userdata.startMonth = userdata.months.sort((a, b) => {
        return monthMap[a] - monthMap[b]; 
        })[0]
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
        if(userdata.selectDates.includes(card.id)){
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
    saveUsrData();
}
function delLi(element){
    const allSelected = document.getElementsByClassName('selectedPl');
    for(const e of allSelected){
        e.remove();
    }
    checkSelectLi(element)
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

    switch(choice){
        case 'plan':{
            formId= 'dayPlanText';
            listContainId = 'planLiContain';
            liClassName ='dayPl'
            deleteId = 'deleteBtnPl'
            let textIn = document.getElementById(formId);
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
            break;
        }
        case 'pack':{
            formId= 'packText';
            listContainId = 'packListList';
            liClassName ='packLi'
            deleteId = 'deleteBtnPack'
            let textIn = document.getElementById(formId);
            if (!userdata.savedPackingLists[currentTrip]) {
                userdata.savedPackingLists[currentTrip] = [];
            }
            if (textIn.value.trim() !== "") {
                userdata.savedPackingLists[currentTrip].push(textIn.value);
            }
            break;
        }
    }
    let text = document.getElementById(formId);
    let listContain = document.getElementById(listContainId);
    const newLi= document.createElement("li");
    newLi.textContent = text.value
    newLi.className=liClassName
    newLi.onclick=function(){
        this.classList.toggle('selectedPl');
        checkSelectLi(document.getElementById(deleteId))
    }
    listContain.appendChild(newLi);
    text.value="";
    updatePlanLists();
}
function toggleLoginDialog(){
    const login=document.getElementById('loginDialog')
    const signup=document.getElementById('signupDialog')
    if(!login.open && !signup.open){
        login.showModal()
    }
    else if(login.open && !signup.open){
        signup.showModal();
        login.close();
    }
    else if(!login.open && signup.open){
        signup.close();
        login.showModal();
    }
}
function closeDialog(){
  const login=document.getElementById('loginDialog')
  const signup=document.getElementById('signupDialog')   
    login.close();
    signup.close();
}
function toggleRecommsUl(){
    const accountDial = document.getElementById('accountSavedRecoms')
    accountDial.showModal()
    const list = document.getElementById('recommsList')
    list.innerHTML = "";
    for(const recomm of userdata.savedRecommIds){
        const box = document.createElement('li')
        box.className='savedRecomms'
        const title = document.createElement('p')
            title.textContent= getLocation(recomm)
        const dates = document.createElement('p')
            dates.textContent = getDateRange(recomm)
        box.append(title, dates);
        list.append(box);
    }
}
function getRecomms(){
    fetch('http://localhost:3000/recommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tripLength: userdata.days,
            months: userdata.months,
            categories: userdata.categories
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
        for(const recomm of data){
            const li = document.createElement('li')
            li.className = "recomm-item";
            li.id=recomm.ID;
            li.innerHTML = `
                <button type="button" class='recommPick' id="${recomm.ID}" onclick='toggleRecommPick(this)'>
                <img src="${recomm.Pic}" alt="${recomm.City}" class="recomm-img">
                <div class="recomm-info">
                    <strong>${recomm.City}, ${recomm.Country}</strong><br>
                    <small>${recomm.DateRange}</small>
                </div>
                </button>
                <div>
                    <input type="checkbox" class='recommCheck' id="${recomm.ID}">
                </div>
                `;
            container.append(li)}
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function toggleRecommPick(element){
    const currentSelect = document.getElementsByClassName('recommPick selected')
    if(currentSelect.length===0){
        toggleSelected(element);
    }else {
        toggleSelected(currentSelect[0]);
        toggleSelected(element)
    }
    userdata.recommId=element.id;
    saveUsrData();
}
function getTotalDays(){
    fetch(`http://localhost:3000/datesToRecomms?Id=${userdata.recommId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function getDateRange(specId){
    fetch(`http://localhost:3000/datesToRecomms?Id=${specId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function getWeatherForDay(){
    fetch(`http://localhost:3000/weatherInfo?Id=${userdata.recommId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function getLocation(specId){
    let URL = null;
    if(specId){
        URL = `http://localhost:3000/locationInfo?Id=${specId}`
    }else {
        URL= `http://localhost:3000/locationInfo?Id=${userdata.recommId}`
    }
    fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function updatePlanLists(){
    fetch(`http://localhost:3000/updateLists?Id=${userdata.recommId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: 1
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function findCheckedRecomms(){
    const items = document.querySelectorAll('.recommCheck')
    items.forEach(item => {
        if(item.checked && !userdata.savedRecommIds.includes(item.id)){
            userdata.savedRecommIds.push(item.id);
        }
    })
    saveUsrData();
    if (userdata.savedRecommIds){
        return true
    }
    return false;
}