const Notification = ({ message }) => {
  if (message === null) return null;

  if (message.includes("error") || message.includes("Wrong")) {
    return <div className="error">{message}</div>;
  } else {
    return <div className="success">{message}</div>;
  }
};

export default Notification;
