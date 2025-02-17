document.addEventListener("DOMContentLoaded", function () {
    const width = 800;
    const height = 500;

    const nodes = [
        { id: "Frontend", x: 100, y: 100, description: "Interface do usuário", icon: "🔧" },
        { id: "Backend", x: 300, y: 200, description: "Servidor e lógica de aplicação", icon: "⚙️" },
        { id: "Banco de Dados", x: 500, y: 200, description: "Armazenamento de dados", icon: "💾" },
        { id: "Armazenamento", x: 500, y: 350, description: "Armazenamento de arquivos", icon: "📂" },
        { id: "Mensageria", x: 300, y: 350, description: "Comunicação entre serviços", icon: "📩" },
        { id: "Autenticação", x: 100, y: 350, description: "Controle de usuários e sessões", icon: "🔒" }
    ];


    const links = [
        { source: "Frontend", target: "Backend" },
        { source: "Backend", target: "Banco de Dados" },
        { source: "Backend", target: "Armazenamento" },
        { source: "Backend", target: "Mensageria" },
        { source: "Frontend", target: "Autenticação" }
    ];

    const svg = d3.select("#diagram")
                  .attr("width", width)
                  .attr("height", height);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    const link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link");

    const node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("rect")
        .attr("class", "node")
        .attr("width", 160)
        .attr("height", 50)
        .attr("rx", 10)
        .attr("ry", 10)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const label = svg.selectAll(".label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => d.id);

        const icon = svg.selectAll(".icon")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "icon")
        .attr("x", d => d.x)
        .attr("y", d => d.y - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(d => d.icon);

        const modal = document.getElementById("modal");
        const closeModal = document.getElementById("close");
        const modalTitle = document.getElementById("modal-title");
        const modalDescription = document.getElementById("modal-description");

        node.on("click", function(event, d) {
            modal.style.display = "block";
            modalTitle.textContent = d.id;
            modalDescription.textContent = d.description;
        });
    
        closeModal.onclick = function() {
            modal.style.display = "none";
        }
    
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("x", d => d.x - 80)
            .attr("y", d => d.y - 25);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        icon
            .attr("x", d => d.x)
            .attr("y", d => d.y - 30);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
});
