$(function () {

    // 全选单选
    // 全选框改变事件
    $(".select_all1").change(function () {
        // 全选框改变时，checked随之改变，并将其值赋值给单选框的checked
        $(".select_one").prop("checked", $(this).prop("checked"));
        $(".select_all2").prop("checked", $(this).prop("checked"));
        
        // ------------------------------------
        // 选框改变事件触发计算总价事件
        getSum($(".total_price"));
    });
    $(".select_all2").change(function () {
        // 全选框改变时，checked随之改变，并将其值赋值给单选框的checked
        $(".select_one").prop("checked", $(this).prop("checked"));
        $(".select_all1").prop("checked", $(this).prop("checked"));
        
        // ------------------------------------
        // 选框改变事件触发计算总价事件
        getSum($(".total_price"));
    });
    // 单选框改变事件
    $(".select_one").change(function () {
        // :checked用于查找选中的单选框
        if ($(".select_one:checked").length === $(".select_one").length) {
            $(".select_all1").prop("checked",true);
            $(".select_all2").prop("checked",true);
        } else {
            $(".select_all1").prop("checked",false);
            $(".select_all2").prop("checked",false);
        }

        // ------------------------------------
        // 选框改变事件触发计算总价事件
        getSum($(".total_price"));
    });


    // 获取购买栏的输入框 purchase
    var purchase = $(".purchase");
    // 获取库存栏的输入框 stock
    var stock = $(".stock");
    // ------------------------------------
    // 调用函数，把库存栏传进函数
    dataChange(stock);
    // 调用函数，把购买数量栏传进函数
    dataChange(purchase);
    // ------------------------------------
    // 删除事件
    $(".delete").click(function () {
        console.log( $(this).parent());
        // 采用slideUp只是隐藏元素，而不是删除元素
        // 全选仍然会勾选隐藏的元素
        $(this).parent().parent().slideUp(function () {
            // 注意这里的this，是在$(this).parent().parent()内部
            // 即这个this就指向$(this).parent().parent()
            $(this).remove();
            // console.log(this);
            // 删除事件后需要再执行一次计算总价
            getSum($(".total_price"));
        });
        
    });
    // ------------------------------------
    // 先执行一次计算总价函数
    getSum($(".total_price"));

});

// 尝试封装为函数-------
// 用于不同栏：库存栏、购买数量栏的点击事件
// 否则,$(".btn")会获取所有匹配的类
function dataChange(e) {
    // 这个 e 是 $("[type=number]") 数字输入框

    // ------------------------------------------------------
    // 先触发一次 input 改变事件，执行一次判断函数
    // e.siblings("[type=number]").trigger("change");   //这行代码没有用，没有改变，无法触发

    // -------------------------------------------------------------
    // 调用函数 changeFunc()，用于判断 input 数字大小，控制增减按钮是否禁用
    // 传入 数字输入框
    // changeFunc(e);
    // console.log(e);
    // 调用函数 Cal()，用于计算商品初始价格
    // 传入input对象即可，和input值（Number类型）
    // Cal(e,parseFloat(e.prop("value")));


    // ---------------------------------------------------
    // 1.遍历e伪数组，分别进行初始化
    // console.log($(e[1]).prop("value"));
    // console.log(e.length);
    for (var i = 0; i < e.length; i++){
        // 初始化时执行了一次changeFunc函数
        changeFunc(e[i]);
        Cal(e[i],parseFloat($(e[i]).prop("value")));
    }
    // -------------------------------------------------------------
    //2.增加、减少的点击事件,是 数字输入框 的兄弟节点 按钮输入框 的事件
    e.siblings(".btn").click(function () {
        // 这里的 this ——————是DOM对象,是点击的那个按钮
        // console.log(this);
        // console.log($(this));
        // console.log($(this).siblings(".btn"));
        // 1.获取数字输入框的 value 值，数字化
        var number = parseInt($(this).siblings("[type=number]").prop("value"));
        // 2.获取当前点击元素在当前行的父元素中的索引值：0为减少按钮，1为增加按钮
        // 选取兄弟元素 stock，再选取兄弟元素 btn，获取其 索引号
        var index = $(this).siblings("[type=number]").siblings(".btn").index(this);
        // console.log(index);
        // 3.判断增减，为1则是增加按钮，就加；为0则是减少按钮，就减
        if (index) {
            ++number;
            // console.log(number);
        } else {
            --number;
        }
        // 4.设置值
        $(this).siblings("[type=number]").prop("value", number);
        // 5.把当前点击元素和库存值传进判断函数
        // 为什么不放前面？因为可以触发点击事件，那么必然数字不为0或99
        // 在初始化时就已经 判断按钮状态了
        // 所以,这里在点击改变数字后,再判断按钮状态
        judge(this,number);
        
        
        // 把当前元素 this（DOM对象）传入Cal函数，计算当前商品总价钱
        // 这里的 this 是按钮类输入框，和数字类输入框同一级
        // Cal(this, number);
        // 商品总价只会随购买数量的number值变化而变化，所以需要加一个判断
        // 是购买栏的点击、改变事件才进行计算总价
        if ( $(this).siblings("[type=number]").hasClass("purchase")) {
            Cal(this, number);
        }

        // 把计算总价放在事件最后
        getSum($(".total_price"));
    });

    // 3.输入框改变事件，是数字输入框的事件
    e.change(function () {
        // console.log(this);
        // -------------------------------------------
        // 1.传递元素到 changeFunc 函数
        var number = changeFunc(this);
        // 2.设置改变后的值
        $(this).prop("value", number);

        // 3.复合写法，由于后面还要传递 number，故不采用复合写法
        // $(this).prop("value", changeFunc(this));
        // ---------------------------------------------------
        // 这里是判断购买数量必须要小于等于库存数量
         // 获取库存数量
        // var m = parseInt($(this).parent().parent().find(".stock").prop("value"));
        //  // 获取购买数量
        // var n = parseInt($(this).parent().parent().find(".purchase").prop("value"));

        // if (m < n) {
        //     $(this).parents().parent().find(".purchase").prop("value",m);
        // }
        // ----------------------------------------------------------
        // 把当前元素 this（DOM对象）传入Cal函数，计算当前商品总价钱
        // 这里的 this 是 数字类输入框，和按钮类输入框同一级
        // Cal(this,number);
        // 商品总价只会随购买数量的number值变化而变化，所以需要加一个判断
        // 是购买栏的点击、改变事件才进行计算总价
        if ($(this).hasClass("purchase")) {
            // 判断购买数量是否小于等于库存数量
            Cal(this, number); 
        }

        // 把计算总价放在事件最后
        getSum($(".total_price"));
    });
}
// 判断增减按钮是否禁用,第一个参数是具体增减按钮DOM元素，第二个参数是输入框值
function judge(domEle, number) {
    // 传进来的是DOM对象
    // console.log(domEle);
    // 如果传进的不是对象，则直接返回
    if (!domEle) return;

    // -------------------------------------
    // 1.判断传进来的是哪个按钮：减少按钮 || 增加按钮
    // 从changeFunc函数传进来的按钮：超过最大值为增加按钮，其它为减少按钮
    // 从changeFunc函数传进来的值：库存值不超过99，购买数量值不超过库存值

    // 从btn点击传进来的按钮:谁点击传谁，
    //                  值：传点击按钮所在的 input 框的值
    // 获取按钮在当前栏下的索引号，减少按钮为0，增加按钮为2
    var index = $(domEle).index();
    // 获取购买数量
    var m = parseInt($(domEle).parent().parent().find(".purchase").prop("value"));
    // 获取库存数量
    var n = parseInt($(domEle).parent().parent().find(".stock").prop("value"));
    if (index) {
        // 如果为增加按钮,执行这里的代码
        // 1.移除兄弟的禁止标志
        // 因为触发了增加按钮，所以增加按钮一定可以点击，不是禁用状态
        // 如果是输入改变，也不会影响
        $(domEle).siblings().removeAttr("disabled");
        // console.log($(domEle).siblings("[type=number]"));
        // 判断是否是购买数量框下的增加按钮
        if ($(domEle).siblings("[type=number]").hasClass("purchase")) {
            // 如果是购买数量框，那么
            // 1.判断购买数量是否大于库存值
            if (m >= n) {
                // 如果购买数量大于等于了库存数量，购买数量就等于库存数量
                $(domEle).siblings("[type=number]").prop("value", n);
                // 购买数量变了一定要调用计算函数
                Cal($(domEle).siblings("[type=number]"),n);
                getSum($(".total_price"));
                // 并且禁用增加按钮（当前就是增加按钮）
                $(domEle).attr("disabled","disabled");
            }
            // 购买数量小于库存数量是正常情况，不执行任何操作
        } else {
            // 如果不是购买数量框下的按钮，则为库存下的增加按钮
            // 1.先判断number值
            if (number >= 99) {
                $(domEle).attr("disabled","disabled");
            }
            // 2.再反向关联购买数量框：即取消购买数量的增加按钮禁用状态
            // console.log($($(domEle).parent().parent().find(".purchase").siblings(".btn")[1]));
            $($(domEle).parent().parent().find(".purchase").siblings(".btn")[1]).removeAttr("disabled");
        }
        
    }else {
        // 如果为减少按钮,执行这里的代码
        // 1.移除兄弟增加按钮的禁止标志
        $(domEle).siblings().removeAttr("disabled");
        // 2.如果是库存的减少按钮
        if ($(domEle).siblings("[type=number]").hasClass("stock")) {
            // 如果购买数量原来就等于库存数量
            // 那么库存减少，购买数量也要减少
            // 如果库存大于购买数量(这是特殊情况，由改变事件单独触发)
            if (n > m) {
                // 移除购买数量的增加按钮的禁用状态
                $($(domEle).parent().parent().find(".purchase").siblings(".btn")[1]).removeAttr("disabled");
            } else if (n <= m) {
                // 因为这里是只进行判断，不进行赋值
                // 所以这里先把购买数量赋值为要改变的值 number
                $(domEle).parent().parent().find(".purchase").prop("value", number);
                // 然后计算总价
                Cal($(domEle).parent().parent().find(".purchase"),number);
                getSum($(".total_price"));
                // 再改变购买数量的增加按钮为禁用
                $($(domEle).parent().parent().find(".purchase").siblings(".btn")[1]).attr("disabled","disabled");
            }
        }

        if (number <= 0) {
            $(domEle).attr("disabled","disabled");
        }
    }
    // console.log(index);

    // --------------------------------------
    // console.log($(domEle));
    // 移除增、减的禁止标识，本身移除+兄弟移除
    // $(domEle).removeAttr("disabled");
    // $(domEle).siblings().removeAttr("disabled");
    // 判断数字，如果等于 99 或 0 ,则设置对应按钮禁止
    
}

// 将 input 改变事件的判断数字部分提取为函数
// 目的是为了在事件触发之前可以执行一次函数，以判断增减按钮状态、商品总价状态
function changeFunc(domEle) {
    // 传进来的是 DOM 对象，数字输入框
    // console.log(domEle);

    // -------------------------------------------------------------
    // 直接进入判断
    // 1.先获取 number ,再判断 number 范围，再传递给判断函数 judge
    // 输入空字符串怎么办？？？
    // 加入判断，空字符串设置为0,否则数字化
    var number = ($(domEle).prop("value") == "") ? 0:parseInt($(domEle).prop("value"));
    // -----------------------------------------------
    // 1.判断这个数字输入框是库存还是购买数量
    // 
    var max = 0;
    if ($(domEle).hasClass("stock")) {
        // 是库存则设置最大值为99，
        max = 99;
    } else {
        // 不是库存，则是购买数量，设置最大值为库存值
        max = $(domEle).parent().parent().find(".stock").prop("value");
    }
    // -----------------------------------------------
    
    // 2.判断数字是否超过界限
    // 增减标识
    var index = 0;
    if (number >= max) {
        number = max;
        index = 1;
    } else if (number <= 0) {
        number = 0;
        index = 0;
    }
    // $(domEle).siblings()[index] =$(this).siblings()[index],索引值下的输入框
    // 为 1 则为右边增加按钮，用于判断是否切换为禁用状态
    // 为 0 则为左边减少按钮，用于判断是否切换为禁用状态
    judge($(domEle).siblings()[index], number);
    return number;
    // -------------------------------------------------------------
}

// 尝试封装函数，传入input对象，和input值
// 作用是计算商品总价
function Cal(domEle, number) {
    // 传入DOM对象
    // --------------------------------------
    // 1.获取当前商品单价：父节点的兄弟节点.price类
    // var price = $(domEle).parent().siblings(".price").html();
    // console.log(price);
    // 2.数字化，保留两位小数
    // 保留两位小数后变成字符串，需要再次数字化
    // price = parseFloat(parseFloat(price).toFixed(2));
    // 3.复合写法
    // 因为number是数字，所以这里可以不用数字化
    // var price = parseFloat(parseFloat($(domEle).parent().siblings(".price").html()).toFixed(2));
    var price = $(domEle).parent().siblings(".price").html();
    // ------------------------------------
    // 1.获取当前商品：父节点的兄弟节点.total_price类
    // var total_price =  $(domEle).parent().siblings(".total_price");
    // 2.计算总价为：数量 X 单价
    // var sum = (number * price).toFixed(2);
    // 3.设置总价
    // total_price.html(sum);
    // 3.复合
    $(domEle).parent().siblings(".total_price").html((number * price).toFixed(2));
    // console.log(total_price.html());
}

// 计算总价，直接传入$(".total_price")
function getSum(e) {
    // // 获取兄弟元素：总价total_price
    // // var e = domEle.parent().siblings(".total_price");
    // // 设置总价
    // var sum = 0;
    // // 循环获取值并累加
    // for (var i = 0; i < e.length; i++){
    //     sum += parseFloat($(e[i]).html());
    // }
    // console.log(sum);
    // // 设置值
    // $(".sum").children("span").html(sum.toFixed(2));

    // 以上为计算所有商品，无论是否勾选
    // ------------------------------------------
    // 如果要求只计算勾选的商品
    // e = $(".total_price")
    // 1.首先查找 e 的兄弟元素 select_box 下的select_one
    var select_one = e.parent().find(".select_one");
    // 2.设置变量 sum总价
    var sum = 0;
    // 3.判断select_one的checked状态
    for (var i = 0; i < select_one.length; i++){
        // 把checked状态放入判断条件中
        if ($(select_one[i]).prop("checked")) {
            // 如果选中了则为真，就找到选中元素的父元素的兄弟元素total_price，获取值
            sum += parseFloat($(select_one[i]).parent().siblings(".total_price").html());
        }
    }
    // 4.设置最后的值
    $(".sum").children("span").html(sum.toFixed(2));
    // console.log(select_one);
}
