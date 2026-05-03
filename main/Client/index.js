let userdata = {
    days: 0,
    timeframe:[],
    category:[],
}
let userSelection = {
    recommendation: []
}
const monthMap = {
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
    "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
};
const reverseMonthMap = Object.fromEntries(
    Object.entries(monthMap).map(([name, num]) => [num, name])
);
window.onload = function () {
}
function monthChoice(month, element){
    if(!userdata.timeframe.includes(month)){
        userdata.timeframe.push(month);
        element.classList.add('selected');
    }else {
        userdata.timeframe = userdata.timeframe.filter(m => m !== month)
        element.classList.remove('selected');
    }
    
}
function catchoice(category, element){
    if(!userdata.category.includes(category)){
        userdata.category.push(category)
        element.classList.add('selected');
    }else {
        userdata.category = userdata.category.filter(c => c !== category)
        element.classList.remove('selected');
    }
}
let startMonth 
function toggleView(currentPage){
    console.log(userdata.days);
    console.log(userdata.timeframe.length)
    
    switch(currentPage){
        case 'start':
            userdata.days=document.getElementById('search').value
            if(userdata.days>0){
            document.getElementById('mainPage').classList.add('hidden');
            document.getElementById('chPage1').classList.remove('hidden');}
            else{
                alert("Please input amount of days")
            }
            break;
        case 'timeframe':
            if(userdata.timeframe.length!==0){
            document.getElementById('chPage1').classList.add('hidden');
            document.getElementById('chPage2').classList.remove('hidden');}
            break;
        case 'vacType':
            if(userdata.category.length!==0){
            document.getElementById('chPage2').classList.add('hidden');
            document.getElementById('chPage3').classList.remove('hidden');}
            break;
        case 'recomms':
            document.getElementById('chPage3').classList.add('hidden');
            document.getElementById('finPage').classList.remove('hidden');
            startMonth = userdata.timeframe[0];
            generateCalendar(userdata.timeframe[0]);
            break;
        case 'timeframeBack':
            document.getElementById('chPage1').classList.add('hidden');
            document.getElementById('mainPage').classList.remove('hidden');
            break;
        case 'vacTypeBack':
            document.getElementById('chPage2').classList.add('hidden');
            document.getElementById('chPage1').classList.remove('hidden');
            break;
        case 'recommsBack':
            document.getElementById('chPage3').classList.add('hidden');
            document.getElementById('chPage2').classList.remove('hidden');
            break;
        case 'finalViewBack':
            document.getElementById('finPage').classList.add('hidden');
            document.getElementById('chPage3').classList.remove('hidden');
    }

}
function generateCalendar(month) {
    const container = document.getElementById('calendarGrid');
    container.innerHTML = ""; 
    document.getElementById('calTitle').innerHTML=`${month}`
    for (let i = 1; i <= getDaysForSelectedMonths(month); i++) {
        const card = document.createElement('div');
        card.className = 'calDay-card';
        card.innerHTML = `
            <button class="calDateBtn">${i}</button>
        `;
        container.appendChild(card);
    }
}
function getDaysForSelectedMonths(month) {
    let results = {};
        const monthNumber = monthMap[month];
        const daysCount = new Date(2026, monthNumber, 0).getDate();
    return daysCount;
}
function changeMonth(switchDir){
    let currentMonthNumb = monthMap[startMonth];
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
    startMonth=reverseMonthMap[currentMonthNumb];
    generateCalendar(startMonth)
}
function addPlans(){
    let inputText = document.getElementById('dayPlanText')
    createLi(inputText.value)
    inputText.value="";
}
function deletePl(){
    const allSelected = document.getElementsByClassName('selectedPl');
    for(const e of allSelected){
        e.remove();
    }
    checkSelectPl()
}
function checkSelectPl(){
    const anySelected = document.querySelectorAll('.selectedPl').length > 0;
    if (anySelected) {
        document.getElementById('deleteBtnPl').classList.remove('hidden');
    }else {
        document.getElementById('deleteBtnPl').classList.add('hidden');
    }
}
function createLi(text){
    const listContain = document.getElementById('planLiContain')
    const newLi= document.createElement("li");
    newLi.textContent = text
    newLi.onclick=function(){
     this.classList.toggle('selectedPl');
     checkSelectPl()
    }
    listContain.appendChild(newLi);
}