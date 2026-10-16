
function EmailNaver() {

  return (
    <>
    <h1>이메일 쓰기</h1>
    <form action="/action_page.php">
    <div className="mb-3 mt-3">
        <label for="to" className="form-label">받는 사람</label>
        <input type="email" className="form-control" id="to" placeholder="Enter email" name="to"/>
    </div>
    <div className="mb-3">
        <label for="pwd" className="form-label">제목</label>
        <input type="txt" className="form-control" id="pwd" placeholder="Enter password" name="pswd"/>
    </div>
        <div className="mb-3">
        <label for="pwd" className="form-label">제목</label>
        <input type="txt" className="form-control" id="pwd" placeholder="Enter password" name="pswd"/>
    </div>
    <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </>
  )
}

export default EmailNaver