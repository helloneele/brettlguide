export default function () {
  let scrollTopButton = document.getElementsByClassName("scrollTop")[0]
  scrollTopButton.addEventListener("click", scrollContentTop)
}

function scrollContentTop(){
    let height = window.innerHeight - 80

    let scroll = 0.1  // initial opacity
    let timer = setInterval(function () {
        if (scroll >= height){
            clearInterval(timer)
        }
        window.scrollTo(0, scroll)
        scroll += scroll * 0.6
        if(scroll > height){
            clearInterval(timer)
            window.scrollTo(0, height)
        }
    }, 70);
}
