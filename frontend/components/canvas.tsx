import React, { useEffect, useRef } from 'react'

const Canvas = (props: unknown): JSX.Element => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const dpr = window.devicePixelRatio;

    const canvas = canvasRef.current;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild(canvas);

    const context = canvas.getContext('2d');

    const image = document.createElement('img');

    image.addEventListener('load', function () {

      const width = this.width * Math.round(dpr);
      const height = this.height * Math.round(dpr);
      const widthHalf = width / 2;
      const heightHalf = height / 2;

      document.addEventListener('pointermove', function (event) {

        const x = Math.round((event.clientX * dpr) - widthHalf);
        const y = Math.round((event.clientY * dpr) - heightHalf);

        context.drawImage(image, x, y, width, height);

      });

    }, false);

    image.src = 'https://docs.microsoft.com/en-us/windows/win32/dlgbox/images/messagebox-01.png'
  })

  // useEffect(() => {
  //   const canvas = canvasRef.current
  //   const context = canvas.getContext('2d')
  //   //Our first draw
  //   context.fillStyle = '#f2f2f2'
  //   context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  // }, [])

  return <canvas ref={canvasRef} {...props} />
}

export default Canvas