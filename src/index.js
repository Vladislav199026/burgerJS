import './main.scss';

// Создать бургер меню.
// 1. Цвета не важны. Сделать обычное меню на десктопе, а начиная с 768px сделать бургер.
// 2. Использовать ооп или просто функциональное программирование.
// 3. Сделать возможность задавать вид анимации (слайд, фейд)
// 4. Анимацию самого бургера сделать через стили, не через подмену иконок.
// 5. Если пунктов меню много и они выходят за экран, должен появляться скрол внутренний, боди при этом не крутится.
// 6. Сделать возможным показывать бургер сдвигая при этом вправо весь сайт.

'use strict'

class BurgerMenu {
    constructor(animationType) {
        this.wrapHeader = document.querySelector('.wrapper-header'),
        this.btnMenu = document.querySelector('.button-burger'),
        this.menu = document.querySelector('.menu'),
        this.mainContent = document.querySelector('.description'),
        this.position = null,
        this.animationType = animationType,
        this.clone = null,
        this.count = 0
    }

    showBurgerMenu() {
        this.btnMenu.classList.toggle('is-active');
        if (this.count > 0) {
            this.count = 1;

            if (this.animationType === 'fade') {
                this.menu.style.height = `calc(100vh - ${this.wrapHeader.offsetHeight}px)`;
                this.menu.classList.toggle('menu-active-fade');
            } else if (this.animationType === 'slide') {
                this.menu.style.opacity = '1';
                this.menu.style.height = `calc(100vh - ${this.wrapHeader.offsetHeight}px)`;
                this.menu.classList.toggle('menu-active-slide');

                if (!this.btnMenu.classList.contains('is-active')) {
                    this.menu.style.height = '0';
                };
            };
            
        } else {
            this.mainContent.addEventListener('transitionend', () => {
                if (window.getComputedStyle(this.mainContent).getPropertyValue('transform') == 'none') {
                    this.clone.classList.remove('clone-menu');
                    this.clone.remove();
                };
            });
            this.mainContent.classList.toggle('swipe-menu');
            this.count = 1;
        };
    }

    clickBurgerMenu() {
        this.count = 1;

        this.btnMenu.addEventListener('click', (event) => {
            event.preventDefault();
            this.showBurgerMenu();
        });
    }

    swipeRight() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            this.mainContent.classList.add('swipe-menu');
            this.clone = this.menu.cloneNode(true);
            this.clone.classList.add('clone-menu');
            this.clone.classList.remove('menu');
            this.mainContent.prepend(this.clone);
            this.btnMenu.classList.toggle('is-active');

            if (this.clone.classList.contains('clone-menu')) {
                this.clone.style.minHeight = `calc(100vh - ${this.wrapHeader.offsetHeight}px)`;
            };

            this.count = 0;
        } else {
            return
        };
    }

    swipe() {
        document.addEventListener('touchstart', (event) => {
            this.position = event.changedTouches[0].clientX;
        });

        document.addEventListener('touchend', (event) => {
            event.changedTouches[0].clientX - this.position > 50 && this.swipeRight();
        });
    }

    activateResizeHandler() {
        const win = window;
        let resizeClass = 'resize-active';
        const doc = document.documentElement;
        let flag = null;
        let timer = null;
    
        const removeClassHandler = () => {
            flag = false;
            doc.classList.remove(resizeClass);
        };
    
        const resizeHandler = () => {
            if (!flag) {
                flag = true;
                doc.classList.add(resizeClass);
            };

            if (window.matchMedia("(min-width: 768px)").matches) {
                this.btnMenu.classList.remove('is-active');

                if(this.menu.classList.contains('menu-active-slide') || this.menu.classList.contains('menu-active-fade')) {
                    this.menu.classList.remove('menu-active-slide');
                    this.menu.classList.remove('menu-active-fade');
                    this.menu.style.height = `0`;
                };
                
                if (this.clone) {
                    this.clone.classList.remove('clone-menu');
                    this.mainContent.classList.remove('swipe-menu');
                    this.count = 1;
                    this.clone.remove();
                };
            };
    
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
    
        win.addEventListener('resize', resizeHandler);
        win.addEventListener('orientationchange', resizeHandler);
    }
};

let burgerMenu = new BurgerMenu('fade'); //slide or fade

burgerMenu.swipe();
burgerMenu.clickBurgerMenu();
burgerMenu.activateResizeHandler();