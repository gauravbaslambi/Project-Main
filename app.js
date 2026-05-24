async function submitVote() {

    const voterId = document.getElementById("voterId").value;
    const candidate = document.getElementById("candidate").value;

    const response = await fetch("/vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            voterId,
            candidate
        })
    });

    const data = await response.json();

    document.getElementById("message").innerText = data.message;
}

async function loadResults() {

    const response = await fetch("/results");

    const data = await response.json();

    const resultsList = document.getElementById("results");

    resultsList.innerHTML = "";

    data.forEach(item => {

        const li = document.createElement("li");

        li.innerText = `${item._id}: ${item.totalVotes} votes`;

        resultsList.appendChild(li);
    });
}
