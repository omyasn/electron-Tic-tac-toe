var $ = require('jquery');
var playerSign;
var compSign;
var whoseTurn;
var fillCell=0;//отслеживает заполненость поля, если =9, то пустых клеток не осталось

//выиграшные комбинации, цифра соответствует номеру клетки с*
var winComb=[[0, 1, 2], [3, 4, 5], [6, 7, 8], //горизонатали
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //вертикали
    [0, 4, 8], [2, 4, 6]];          //диагонали
var cellPrior=[0, 0, 0, //приоритет клеток для каждого хода
    0, 0, 0, //индекс внутри массива = номеру клетки с*
    0, 0, 0]
//-------------------------------------------------------------
//если ячейка не заполнена, ставит туда знак и ставит ячейке класс filled
function putSign(cellId,sign){
    //console.log("PUT cellId="+cellId);
    //console.log("PUT !filled= "+!$("#"+cellId).hasClass("filled"))
    if (!$("#"+cellId).hasClass("filled")){
        //console.log("1");
        $("#"+cellId+" span").html(sign);
        $("#"+cellId+" span").css("display", "none");
        fillCell+=1;
        $("#"+cellId).addClass("filled");

        $("#"+cellId+" span").fadeIn(500);
        win();
        return true;
    }else{
        return false;
    }
}
//-------------------------------------------------------------
//возвращает индекс максимального элемента в массиве array
function maxArr( array ){
    var max=array[0];
    var maxI=0;
    for (var i=1;i<array.length;i++){
        if (max<array[i]){
            max=array[i];
            maxI=i;
        }
    }
    return maxI;
}

//-------------------------------------------------------------
//На вход принимает выигрушную комбинацию(линию) из 3 номеров полей
//проверяет есть ли в линии знаки врага(игрока) и выставляет на основе этого приоритет полям
function havePlayers(comb){
    var flag1=0;
    for (var i=0;i<3;i++){
        if ($("#c"+comb[i]).text().charCodeAt(0)===playerSign.charCodeAt(0)){
            flag1=flag1+1;
        }
    }//for

    for (var i=0;i<3;i++){
        if (flag1===1){
            cellPrior[comb[i]]-=1;//если на линии есть чужой, то приоритет-1
        }else if (flag1===2){
            cellPrior[comb[i]]+=4;//если на линии 2 чужих, то приоритет +4
        }else if (flag1===0){
            cellPrior[comb[i]]+=1;//если на линии нет чужих, то приоритет +1
        }//if
    }//for2
}//end
//-------------------------------------------------------------
//На вход принимает выигрушную комбинацию(линию) из 3 номеров полей
//проверяет есть ли в линии свои знаки и выставляет на основе этого приоритет полям
function haveComp(comb){

    var flag2=0;
    for (var i=0;i<3;i++){
        if ($("#c"+comb[i]).text().charCodeAt(0)===compSign.charCodeAt(0)){
            flag2=flag2+1;
        }

    }//for

    for (var i=0;i<3;i++){
        if (flag2===1){
            cellPrior[comb[i]]+=1;//если на линии есть своя, то приоритет+1
        }else if (flag2===2){
            cellPrior[comb[i]]+=10;//если на линии 2 своих, то приоритет +10,т.к это безусловный выигрыш
        }
    }//for2
}//end

//-------------------------------------------------------------
//ставит всем заполеным клеткам приоритет -100
function priorPreparation(){
    for (var i=0;i<9;i++){
        if ($("#c"+i).hasClass("filled")){
            cellPrior[i]=-100;
        }//if
    }//for
}
//-------------------------------------------------------------
//расставляются через вызыв функций приоритеты всем полям
//возвращается номер поля с максимальным приоритетом
function logic(){
    //console.log("NEW logic in--------------------------------------");
    cellPrior=[0, 0, 0, 0, 0, 0, 0, 0, 0];
    priorPreparation();
    //console.log("after prep "+cellPrior);
    //console.log("1");
    for (var i=0;i<8;i++){
        havePlayers(winComb[i]);
        haveComp(winComb[i]);
    }//for
    //console.log("2");
    //console.log(cellPrior);

    var rand=Math.floor(Math.random()*2);
    //console.log("rand "+rand);
    if ((fillCell<=1)&(!$("#c4").hasClass("filled"))&(rand===0)){
        return 4;
    }
    return maxArr(cellPrior);
}

//-------------------------------------------------------------
/*проверяет, если ход компа,
 то генерит случайные номера клеток, пока не попадется пустая, ставит туда.
 Если при этом поле не закончилось, то передает ход игроку*/
function compTurn(){
//console.log("c turn "+"fillCell= "+ fillCell);
    if ((whoseTurn==="c")&(fillCell<9)){
        //чтобы поле выбиралось рандомно
        /*var id=Math.floor(Math.random()*9);
         while ((!putSign("c"+id,compSign))&(fillCell<9)){
         id=Math.floor(Math.random()*9);
         }*/

        var finalInd=logic();
        //console.log("3");
        //console.log("finalInd="+finalInd);
        putSign("c"+finalInd, compSign);
        //console.log("c turn after filled= "+$("#c"+finalInd).hasClass("filled")+" c"+finalInd);
        if (whoseTurn!=="end"){
            whoseTurn="p";
        }
    }//if
}

//-------------------------------------------------------------
/*проверяет выигрошные комбинации, если одна из них совпала,то показывает алерт
 и переводит whoseTurn="end";*/
function win(){
    for (var i=0;i<8;i++){
        if (($("#c"+winComb[i][0]).text()===$("#c"+winComb[i][1]).text())&($("#c"+winComb[i][1]).text()===$("#c"+winComb[i][2]).text())&($("#c"+winComb[i][0]+" span").text()!==" ")){
            var text="";
            if (whoseTurn==="p"){
                text="YOU WIN";
            }else{
                text="YOU LOSE";
            }
            whoseTurn="end";
            $("#c"+winComb[i][0]).css("background-color","rgba(58, 86, 113, 0.7)");
            $("#c"+winComb[i][1]).css("background-color","rgba(58, 86, 113, 0.7)");
            $("#c"+winComb[i][2]).css("background-color","rgba(58, 86, 113, 0.7)");
            //setTimeout(function(){alert(name+ " wins!");}, 550);
            setTimeout(function(){showMsg(text);}, 500);
        }

    }//for
}//win()

function showMsg(text){
    $("#textMsg").html(text);
    $("#overlay").fadeIn(200,
        function(){
            $("#modalMsg").css('display', 'block') ;
            $("#modalMsg").animate({opacity: 1}, 100);
        })
}

$(document).ready(function() {
//-------------------------------------------------------------
    $(".cell").on("click", function(){
        console.log("p turn");
        if (whoseTurn==="p"){
            //console.log("this.id="+this.id);
            //console.log("P turn before filled= "+$("#"+this.id).hasClass("filled"));

            if (putSign(this.id,playerSign)&&(whoseTurn!=="end")){
                //console.log("P turn after filled= "+$("#"+this.id).hasClass("filled"));
                whoseTurn="c";
                setTimeout(function(){compTurn();},500);
            }
        }

    })

    //-------------------------------------------------------------
    $("#btn-x").on("click",function(){
        playerSign="X";
        compSign="O";
        whoseTurn="p";//player
        $("#chooseSign").addClass("hide");
    });

    //-------------------------------------------------------------
    $("#btn-o").on("click",function(){
        playerSign="O";
        compSign="X";
        whoseTurn="c";//computer
        $("#chooseSign").addClass("hide");
        compTurn();
    });

    //-------------------------------------------------------------
    $("#btn-reset").on("click",function(){
        $("#chooseSign").removeClass("hide");
        $(".cell").removeClass("filled");
        $(".cell span").html(" ");
        playerSign=compSign=undefined;
        $(".cell").css("background-color","transparent");
        fillCell=0;

    });


    //-------------------------------------------------------------
    $('#closeMsg, #overlay').click( function(){
        $('#modalMsg').animate({opacity: 0}, 100,
            function(){
                $(this).css('display', 'none');
                $('#overlay').fadeOut(200);
            }
        );
    });

});//end $(document).ready





