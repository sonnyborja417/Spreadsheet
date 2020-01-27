using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

namespace SpreadsheetAPI.Controllers
{
    public class MathField
    {
        public string FieldId { get; set; }
        public string FieldValue { get; set; }
        public string FieldFormula { get; set; }
        public string FieldFormulaRaw { get; set; }
    }
    
    [Route("api/mathfield")]
    [ApiController]
    public class MathFieldController : ControllerBase
    {        
        
        [HttpPost]
        public MathField Post([FromBody] MathField mathField)
        {
            double result = Convert.ToDouble(new System.Data.DataTable().Compute(mathField.FieldValue.Replace('=',' '), null));

            mathField.FieldFormula = mathField.FieldValue;
            mathField.FieldValue = result.ToString();
            return mathField;
        }

        
    }
}
