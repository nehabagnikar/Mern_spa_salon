

function InfoMessage({message}: {message: string}) {
  return (
    <div className='p-5 bg-gray-200 border border-gray-400 text-sm'>
        {message}
    </div>
  )
}

export default InfoMessage