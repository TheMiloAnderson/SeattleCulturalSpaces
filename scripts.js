window.onload = (function() {
    var newVisitText = document.getElementById('newVisitText');
    var returnVisitText = document.getElementById('returnVisitText');
    var neighborhoodText = document.getElementById('neighborhoodText');
    var neighborhoodSelect = document.getElementById('neighborhoods');
    var saveButton = document.getElementById('saveButton');
    var dataTable = document.getElementById('data');
    var dataTableBody = document.getElementById('dataBody');
    var dataURL = 'https://data.seattle.gov/resource/bsta-72tn.json';
    
    //  get unique neighborhoods, populate <select> options
    var neighborhoodsURL = dataURL + '?$select=neighborhood&$group=neighborhood';
    getData(neighborhoodsURL, displayNeighborhoods);
    //  if a neighborhood is saved, display data & show return visit text
    if (window.localStorage.getItem('neighborhood')) {
        var neighborhood = window.localStorage.getItem('neighborhood');
        var params = '?$select=name,dominant_discipline,url,ada_compliant,serve_alcohol,address&neighborhood=';
        var culturalSpacesURL = dataURL + params + neighborhood;
        getData(culturalSpacesURL, displayCulturalSpaces);
        newVisitText.classList.add('hide');
        returnVisitText.classList.remove('hide');
        neighborhoodText.textContent = neighborhood;
    }
    //  upon selection, get data & populate table, highlight save button & set listener
    neighborhoodSelect.onchange = function() {
        var neighborhood = this.value;
        var params = '?$select=name,dominant_discipline,url,ada_compliant,serve_alcohol,address&neighborhood=';
        var culturalSpacesURL = dataURL + params + neighborhood;
        getData(culturalSpacesURL, displayCulturalSpaces);
        saveButton.classList.add('active');
        saveButton.onclick = function() {
            window.localStorage.setItem('neighborhood', neighborhood);
            saveButton.classList.remove('active');
            neighborhoodText.textContent = neighborhood;
        };
    };
    
    function getData(url, callback) {
        var http = new XMLHttpRequest();
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                callback(http.responseText);
            }
        };
        http.open('GET', url, true);
        http.send(null);
    }
    
    function displayNeighborhoods(responseText) {
        var dataObj = JSON.parse(responseText);
        for (var i = 0; i < dataObj.length; i++) {
            var opt = document.createElement('option');
            opt.value = dataObj[i].neighborhood;
            opt.textContent = dataObj[i].neighborhood;
            neighborhoodSelect.appendChild(opt);
        }
    }
    
    function displayCulturalSpaces(responseText) {
        var dataObj = JSON.parse(responseText);
        dataTable.classList.remove('hide');
        dataTableBody.innerHTML = '';
        for (var i in dataObj) {
            var row = dataTableBody.insertRow(i);
            var name = row.insertCell(0);
            name.innerHTML = dataObj[i].name ? dataObj[i].name : '';
            var type = row.insertCell(1);
            type.innerHTML = dataObj[i].dominant_discipline ? dataObj[i].dominant_discipline: '';
            var address = row.insertCell(2);
            address.innerHTML = dataObj[i].address ? dataObj[i].address : '';
            var url = row.insertCell(3);
            var link = '<a href="' + dataObj[i].url + '" target="_blank">' + dataObj[i].url + '</a>';
            url.innerHTML = dataObj[i].url ? link : '';
            var ada = row.insertCell(4);
            ada.innerHTML = dataObj[i].ada_compliant ? dataObj[i].ada_compliant : '';
            var ada = row.insertCell(5);
            ada.innerHTML = dataObj[i].serve_alcohol ? dataObj[i].serve_alcohol : '';
        }
    }
})();