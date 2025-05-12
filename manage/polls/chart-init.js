document.addEventListener('DOMContentLoaded', () => {
    //Lookup Table Mock Data
    const dataMap = {
      "320": {
        labels: ['Red','Green','Blue','Yellow'],
        datasets: [{ label: '# of Responses (Q320)', data: [1,1,0,0], borderColor: '#D9D9D9', backgroundColor: ['#D00000', '#00784E', '#42A7C6', '#ffd74e'] }]
      },
      "322": {
        labels: ['1','2','3','4'],
        datasets: [{ label: '# of Responses (Q322)', data: [2,3,1,2], borderColor: '#D9D9D9', backgroundColor: ['#D00000', '#00784E', '#D00000', '#D00000'] }]
      },
      "323": {
        labels: ['Pizza','Sushi','Tacos'],
        datasets: [{ label: '# of Responses (Q323)', data: [8,11,3], borderColor: '#D9D9D9', backgroundColor: '#D00000' }]
      }
    };
  
    //Get Question ID
    document.querySelectorAll('.question').forEach(q => {
      const qid = q.dataset.qid;                     // e.g. "320"
      const canvas = q.querySelector(`#chart_${qid}`);
      if (!canvas) return;
  
      // Chart Type
      const typeInput  = q.querySelector(`input[name="chart_${qid}"]:checked`);
      let chartType;
      if (typeInput?.value === 'piechart') {
        chartType = 'pie';
      } else if (typeInput?.value === 'wordcloud') {
          chartType = 'wordCloud'; 
      } else {
          chartType = 'bar';
      }
  
      //User DataMap
      let sampleData = dataMap[qid] 
                        || { labels: [], datasets: [] };

      //Wordcloud
      if (chartType === 'wordCloud') {
        const raw = dataMap[qid].datasets[0];
        const bg  = dataMap[qid].datasets[0].backgroundColor;
        sampleData = {
          datasets: [{
            data: dataMap[qid].labels.map((label, i) => ({
              word:   label,                
              weight: raw.data[i]          
            })),
            color: ctx => bg[ctx.dataIndex] || '#D00000'
          }]
        };
      }
  
      //Draw
      const ctx = canvas.getContext('2d', {willReadFrequently: true});
      new Chart(ctx, {
          type: chartType,
          data: sampleData,
          options: {
              responsive: false,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      labels: {
                          font: {
                              size: 24,
                              color: '#333'
                          }
                      }
                  },
                  ...(chartType === 'wordCloud' && {
                      wordCloud: {
                            minFontSize: 8,
                            padding: 5,
                            maxRetries: 10,
                            rotation: {
                            from: 0,
                            to: 0,
                            num: 1
                            },
                            autoSize: true,
                          color: (ctx) => ctx.raw.color || '#D00000'
                      }
                  })
              },
              ...(chartType === 'bar' && {
                  scales: {
                      x: {
                          ticks: { font: { size: 32 } },
                          title: { font: { size: 32 } }
                      },
                      y: {
                          ticks: { font: { size: 32 } },
                          title: { font: { size: 32 } }
                      }
                  }
              })
          }
      });
    });
  });