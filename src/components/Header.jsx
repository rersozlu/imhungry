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
        I selled my wife for internet connection last week. I need something to
        eat and drink. Please help me.
      </p>
    </header>
  );
}
