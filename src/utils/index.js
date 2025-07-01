export const formatAddress = (address) => {
    return address? `${address.substring(0, 6)}...${address.substring(address.length-5, address.length)}` : '';
}

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

export const formatTimeDifference = (difference) => {
    const totalSeconds = difference;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}