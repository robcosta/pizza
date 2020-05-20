let cart = [];
let modalQt = 1;
let modalKey;
let actualPrice = 0;
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//LISTAGEM DAS PIZZAS
pizzaJson.map((item, index) => {
    //Clona todo o código HTML da classe .pizza-item para cada item mapeado
    pizzaItem = c('.models .pizza-item').cloneNode(true);
    //console.log(`Item: ${item.name} - Index: ${index}`);
    // Buscando o índice da pizza para inserir a informação específica dela no modal a ser aberto
    pizzaItem.setAttribute('data-key', index)
    //console.log(pizzaItem);

    //pizzaItem.querySelector('.pizza-item--img').innerHTML = `<img src=${item.img} />`;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    actualPrice = item.prices[2].toFixed(2);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${actualPrice}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //ABRIR O MODAL
    // pizzaItem.querySelector('.pizza-item a').onclick = (e) => {};
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        //bloqueia a ação de atualizar a tela
        e.preventDefault();
        //console.log("Clicou na pizza!");
        modalQt = 1;
        /* Buscando as informações da pizza clicada que estão: <div class='pizza-item' data-key='0'>
        * e.target - licado no próprio elemento 
        * closest('x') - busca o elemento 'x' mais próximo
        * Ao clicar sobre a pizza va buscar o valor do atributo 'dat-key' da div 'pizza-item'
        */
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        //console.log(pizzaJson[key]);
        /*
        * Apresentar o modal na tela com efeito, este efeito é relaizado pelo css na linha 
        * 132 transition: all ease .5s; , contudo o efeito somente se realizara se o opacity = 1
        * demorar um pouco para ser cionado, dai a necessidade do setTimeout.
        *
        */
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].prices[2].toFixed(2)}`;
        //Desselecionar todos os itens P M G
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            //Selecionando o item G
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            //console.log(size);
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        c('.pizzaInfo--qt').innerHTML = modalQt;


        c('.pizzaWindowArea').style.opacity = 0;//mostra com total transparência
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;//mostra com zero transparência
        }, 200);
    });
    //ADICIONA AS PIZZAS NA DIV 'pizza-area'
    c('.pizza-area').append(pizzaItem);
});

//EVENTOS DOS MODAL
/*
* Função qeu fecha o modal
*
* Cria um evento responsável pelo fechamento do modal
*
*/
//FECHAR MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    });
}
//Professor fEz assim
// Botão de fechar no modo mobyle e cancelar no modo desktop
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

/*//Eu fiz assim
let fechar = cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton')
fechar[0].addEventListener('click', (e) => {
    closeModal();
});
fechar[1].addEventListener('click', (e) => {
    closeModal();
});
*/
//EVENTOS BOTÕES DE QUATIDADES '-' E '+'
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${(actualPrice * modalQt).toFixed(2)}`;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${(actualPrice * modalQt).toFixed(2)}`;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//EVENTOS DO P M G
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        // e.target para selecionar o próprio ítem que esta clicando, mas quebrou quando clicado no span, então usei o próprio size
        //e.target.classList.add('selected');
        size.classList.add('selected');
        actualPrice = pizzaJson[modalKey].prices[sizeIndex].toFixed(2);
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${actualPrice}`;

    });
});

//ADICIONAR AO CARRINHO DE COMPRAS
c('.pizzaInfo--addButton').addEventListener('click', () => {
    //Qual a pizza?
    // console.log("Pizza: " + modalKey);
    //Qual o tamanho?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //console.log("Tamanho: " + size);
    //Quantas pizzas são?
    //console.log("Quantidade: " + modalQt);

    //MONTANDO O CARRINHO
    //Mesma pizza do mesmo tamanho só pode ocupar um index no array cart, independete da quantidade de vezes que clicar em 'Adicionar', ous seja, tem de apenas alterar a quantidade

    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    console.log(cart);
    updateCart();
    closeModal();
});

//ATUALIZA O CARRINHO E, CASO TENHA ALGUM ÍTEM SELECIONADO, ABRE O SIDE LATERAL DA COMPRA
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0) {
        let subTotal = 0;
        c('aside').classList.add('show');
        //Zerar para quando acrescentar outro item no carrinho não repetir os anteriores
        c('.cart').innerHTML = "";

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((pizza) => pizza.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);
            let sizeInfo = 'G';
            if (cart[i].size == 0)
                sizeInfo = "P";
            if (cart[i].size == 1)
                sizeInfo = "M";
            let pizzaInfo = `${pizzaItem.name} (${sizeInfo}) - R$ ${pizzaItem.prices[cart[i].size].toFixed(2)}`
            subTotal += pizzaItem.prices[cart[i].size] * cart[i].qt;
            cartItem.querySelector('.cart--item img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaInfo}`;
            cartItem.querySelector('.cart--item--qt ').innerHTML = cart[i].qt;
            //AÇÔES DOS BOTÕES DO CARRINHO
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            //ADICIONA O CARRINHO NA DIV 'cart' do aside
            c('.cart').append(cartItem);
        }
        c('.subtotal span:nth-child(2)').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        c('.desconto span:nth-child(2)').innerHTML = `R$ ${(subTotal * 0.1).toFixed(2)}`;
        c('.total span:nth-child(2)').innerHTML = `R$ ${(subTotal - (subTotal * 0.1)).toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

//Evento de clicar no carrinho do mobile para mostrar
c('.menu-openner span').addEventListener('click',() =>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click',()=>c('aside').style.left = '100vw');