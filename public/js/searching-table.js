function searchTable(input, tableId) {
    var filter, table, tr, td, i, txtValue;
    filter = input.value.toUpperCase();
    table = document.getElementById(tableId);
    tr = table.getElementsByTagName("tr");  
    for (i = 1; i < tr.length; i++) {
    
      var rowContent = tr[i].textContent;    
      rowContent = rowContent.replace(/[\s]+/g, ' ');
      //console.log(rowContent);    
    
      if (rowContent) {
        if (rowContent.toUpperCase().includes(filter)) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }  
      
    }
  }