function generateSudoku()
{
    var sudoku = [
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','','']
    ];
    
    for(var row=0;row<sudoku[0].length;row++)
    {
        for(var col=0;col<sudoku[0].length;col++)
        {
            var numbers = [1,2,3,4,5,6,7,8,9];
            numbers.sort(() => Math.random() - 0.5);
            while(sudoku[row][col]=='')
            {
                var index = Math.floor(Math.random() * numbers.length-1);
                if(index==-1){index=0;}
                var numgen = numbers[index];
                if(!isNumberInCol(numgen,sudoku,col) && !isNumberInSquare(numgen,sudoku,row,col) && !isNumberInRow(numgen,sudoku,row))
                {
                    if(numgen==undefined){
                        sudoku[row][col]=999;
                        writeSudoku(999,row,col);
                    }else{
                        sudoku[row][col]=numgen;
                        writeSudoku(numgen,row,col);
                    }
                }
                numbers.splice(index,1);
            }
        }
    }
    return sudoku;
}

function isNumberInCol(num,sudoku,col)
{
    for(var i=1;i<=sudoku[0].length;i++)
    {
        if(document.getElementById("r"+i+"c"+(col+1)).innerHTML==num)
        {
            return true;
        }
    }
    return false;
}

function isNumberInRow(num,sudoku,row)
{
    for(var i=1;i<=sudoku[0].length;i++)
    {
        if(document.getElementById("r"+(row+1)+"c"+i).innerHTML==num)
        {
            return true;
        }
    }
    return false;
}

function isNumberInSquare(num,sudoku,row,col)
{
    var squareNum = document.getElementById("r"+(row+1)+"c"+(col+1)).classList[1];
    for(var i=0;i<sudoku[0].length;i++)
    {
        if(document.getElementsByClassName(squareNum)[i].innerHTML == num)
        {
            return true;
        }
    }
    return false;         
}

function writeSudoku(num,row,col)
{
    document.getElementById("r"+(row+1)+"c"+(col+1)).innerHTML = num;
}

generateSudoku();

