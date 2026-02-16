import React from 'react'

const LoginBgVideo = () => {
    return (
        <div className='absolute inset-0 w-full h-full overflow-hidden z-0'>
            <video
                src="/lightning-bg.webm"
                autoPlay
                loop
                muted
                playsInline
                className='absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2'
            ></video>
            <div className='absolute inset-0 bg-black/50'></div>
        </div>
    )
}

export default LoginBgVideo