import "./header.css";

const Header = () => {
  const daysLeft = Math.ceil(
    (new Date(new Date().getFullYear(), 11, 31) - new Date()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="header">
      <div className="header-logo--wrapper">
        <img src="logo.png" />
      </div>
      <p className="days-left-text">{`${daysLeft} days left of this year`}</p>
    </div>
  );
};

export default Header;
