export default function Header({ walletMsg, connectAcc }) {
  return (
    <header>
      <div className="header--top">
        <h1>Buy Me Something</h1>
        <button onClick={connectAcc} className="connectWallet">
          {walletMsg}
        </button>
      </div>
      <p className="header--bot">
        I{" "}
        <a target="_blank" href="https://www.youtube.com/watch?v=nk7Cj209GQg">
          selled my wife for internet connection
        </a>{" "}
        last week. I need something to eat and drink. Please help me.
      </p>
    </header>
  );
}
