window.onload = function () {

}
function toggleView(currentPage){
    switch(currentPage){
        case 'start':
            document.getElementById('startView').classList.add('hidden');
            document.getElementById('categoryView1').classList.remove('hidden');
            break;
        case 'timeframe':
            document.getElementById('categoryView1').classList.add('hidden');
            document.getElementById('categoryView2').classList.remove('hidden');
            break;
        case 'vacType':
            document.getElementById('categoryView2').classList.add('hidden');
            document.getElementById('categoryView3').classList.remove('hidden');
            break;
        case 'timeframeBack':
            document.getElementById('categoryView1').classList.add('hidden');
            document.getElementById('startView').classList.remove('hidden');
            break;
        case 'vacTypeBack':
            document.getElementById('categoryView2').classList.add('hidden');
            document.getElementById('categoryView1').classList.remove('hidden');
            break;
        case 'recommsBack':
            document.getElementById('categoryView3').classList.add('hidden');
            document.getElementById('categoryView2').classList.remove('hidden');
            break;
    }
}