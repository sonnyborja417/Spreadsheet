import { Component, OnInit } from '@angular/core';  
import { MathField } from 'src/app/grid/grid.model'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { RestApiService } from "../shared/rest-api.service";
import { Router } from '@angular/router';

@Component({  
  selector: 'app-grid',  
  templateUrl: './grid.component.html',  
  styleUrls: ['./grid.component.less']  
})  
export class GridComponent implements OnInit {  
  
  constructor(
    public restApi: RestApiService, 
    public router: Router
  ) { }

  colCount: number = 6;
  rowCount: number = 20;
  
  dynamicArray: MathField[][];  
  newDynamic: any = {};  
  ngOnInit(): void {        
      this.dynamicArray = [];
      for(var row=0; row<this.rowCount; row++){
          this.dynamicArray[row] = [];
          for(var col=0;col<this.colCount;col++){        
            //format B5 -> ColB  Row5   
            var colLetter = String.fromCharCode(65 + col ) ;            
            this.newDynamic = {fieldId: colLetter + (row + 1).toString(), fieldValue: "", fieldFormula: "", fieldFormulaRaw: ""};  
            this.dynamicArray[row][col] = this.newDynamic;            
          }        
      }            
  }  
  
  createColumnsRange(){
    var items: string[] = [];
    for(var i = 1; i <= this.colCount; i++){
       var chr = String.fromCharCode(64 + i);
       items.push(chr);
    }
    return items;
  }
  
  createRowsRange(){
    var items: number[] = [];
    for(var i = 1; i <= this.rowCount; i++){       
       items.push(i);
    }
    return items;
  }
    
  addRow(index) {    
      
      this.dynamicArray[this.rowCount] = [];

      for(var col=0;col<this.colCount;col++){    
        var colLetter = String.fromCharCode(65 + col ) ;            
        this.newDynamic = {fieldId: colLetter + (this.rowCount + 1).toString(), fieldValue: "", fieldFormula: "", fieldFormulaRaw: ""};          
        this.dynamicArray[this.rowCount][col] = this.newDynamic;            
      }  
      this.rowCount++;

      return true;  
  }  
  
  addColumn(index) {  
    for(var row=0; row<this.rowCount; row++){            
      var colLetter = String.fromCharCode(65 + this.colCount ) ;            
      this.newDynamic = {fieldId: colLetter + (row+1).toString(), fieldValue: "", fieldFormula: "", fieldFormulaRaw: ""};                  
      this.dynamicArray[row][this.colCount] = this.newDynamic;                          
    }
    this.colCount++;      
    return true;  
  }  


  computeMathFieldValue(row,column) {    
      
    var mathFieldObj = this.dynamicArray[row][column];

    if(mathFieldObj.fieldValue.trim().indexOf('=') === 0) {     
      //check for reference to another field. 
      mathFieldObj.fieldValue = mathFieldObj.fieldValue.toUpperCase();
      var formula = mathFieldObj.fieldValue.trimLeft().substring(1).split(/[\/*+-]/); //take out equal sign then split 
      var formulaRaw = mathFieldObj.fieldValue;
      
      for(var idx=0; idx < formula.length; idx++){                
        var formulae = formula[idx].trim();

        for(var rowIdx=0; rowIdx<this.rowCount; rowIdx++){        
          for(var colIdx=0;colIdx<this.colCount;colIdx++){  
                        
            var referencedValue =  this.dynamicArray[rowIdx][colIdx].fieldValue.trim();                 
            if (formulae == this.dynamicArray[row][column].fieldId ){ //referenced field is not itself
               alert("Circular reference!");
               return false;    

            //validate if refenced field exists 
            }else if ( formulae.length > 0 &&  formulae == this.dynamicArray[rowIdx][colIdx].fieldId ){               
              mathFieldObj.fieldFormulaRaw = formulaRaw; //park the raw formula               
              mathFieldObj.fieldValue = referencedValue.length > 0 ? mathFieldObj.fieldValue.replace(formulae,referencedValue) : mathFieldObj.fieldValue.replace(formulae,"0");            
              break;
            }          
          }        
        }           
      }            

      //post to api
      this.restApi.postFormula(mathFieldObj).subscribe((data: MathField) => {        
        this.dynamicArray[row][column] = data;
      })
      
    }
   
  }

  displayMathFieldFormula(row,column) {    
    var mathFieldObj = this.dynamicArray[row][column];
    
    if(mathFieldObj.fieldFormula.trim().indexOf('=') === 0) {            
        mathFieldObj.fieldValue = mathFieldObj.fieldFormulaRaw.length > 0 ? mathFieldObj.fieldFormulaRaw : mathFieldObj.fieldFormula;        
    }    
  }
    
} 