/**
 * Global UI scripts for UltimateMine
 * Handles ripple effects and generic interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initRippleEffect();
});

function initRippleEffect() {
    const buttons = document.querySelectorAll('.ripple');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            
            let ripples = document.createElement('span');
            ripples.style.left = `${x}px`;
            ripples.style.top = `${y}px`;
            ripples.classList.add('ripple-span');
            
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });
}
