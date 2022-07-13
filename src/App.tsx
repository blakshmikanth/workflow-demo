import React, { useEffect, useRef } from "react";
import { dia, ui, shapes } from "@clientio/rappid";
import "./App.scss";

const App = () => {
  const canvasEl: any = useRef(null);
  const stencilEl: any = useRef(null);
  const inspectorEl: any = useRef(null);

  console.log("Running app...");

  useEffect(() => {
    console.log("canvasEl", canvasEl);

    const graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = new dia.Paper({
      model: graph,
      background: {
        color: "#f8f9fa",
      },
      frozen: true,
      async: true,
      cellViewNamespace: shapes,
    });

    // canvasEl.current.innerHTML = "";
    // canvasEl.current.appendChild(paper.el);

    const scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: false,
      cursor: "grab",
    });

    // useEffect is running twice. Hence, we need to clear existing scroller elements and add new instance
    // canvasEl.current.innerHTML = "";
    canvasEl.current.appendChild(scroller.el);
    scroller.render().center();

    const stencil = new ui.Stencil({
      paper: scroller,
      usePaperGrid: true,
      width: 190,
      dropAnimation: true,
      paperOptions: () => {
        return {
          model: new dia.Graph({}, { cellNamespace: shapes }),
          cellViewNamespace: shapes,
        };
      },
      layout: true,

      // layout: {
      //   column: 1,
      //   rowHeight: "compact",
      //   rowGap: 10,
      //   columnWidth: 80,
      //   marginX: 10,
      //   marginY: 10,
      //   resizeToFit: false,
      //   dx: 0,
      //   dy: 0,
      // },
    });

    stencilEl.current.appendChild(stencil.render().el);
    // stencil.render();

    stencil.load([
      new shapes.basic.Rect({ size: { width: 50, height: 30 } }),
      new shapes.basic.Ellipse({ size: { width: 50, height: 30 } }),
      new shapes.basic.Circle({ size: { width: 30, height: 30 } }),
      new shapes.basic.Rhombus({ size: { width: 50, height: 30 } }),
      new shapes.standard.Link({ size: { width: 50, height: 30 } }),
      new shapes.standard.HeaderedRectangle({ size: { width: 50, height: 30 } }),
      new shapes.standard.BorderedImage({ size: { width: 50, height: 30 } }),
      new shapes.standard.Image({ size: { width: 50, height: 30 } }),
      new shapes.basic.Polygon({
        body: {
          fill: "#FF00FF",
          fillOpacity: 0.5,
        },
        size: { width: 50, height: 30 },
      }),
      new shapes.standard.Circle({ size: { width: 50, height: 30 } }),

      // {
      //   type: "standard.Rectangle",
      //   size: { width: 50, height: 30 },
      // },
      // {
      //   type: "standard.Ellipse",
      //   size: { width: 50, height: 30 },
      // },
      // {
      //   type: "standard.Circle",
      //   size: { width: 50, height: 30 },
      // },
      // {
      //   type: "standard.Cylinder",
      //   size: { width: 50, height: 30 },
      // },
    ]);

    // stencil.on("element:drag", (view, evt, point, validDropTarget) => {
    //   console.log(view, evt, point, validDropTarget);
    // });

    // stencil.on("element:dragend", (view, evt, point, validDropTarget) => {
    //   console.log(view, evt, point, validDropTarget);
    // });

    let inspector: ui.Inspector | null = null;

    paper.on("element:pointerclick", (elementView) => {
      if (inspector) {
        inspector.remove();
      }

      inspector = new ui.Inspector({
        cellView: elementView,
        inputs: {
          "attrs/label/text": {
            type: "content-editable",
          },
        },
      });

      inspector.render();
      inspectorEl.current.appendChild(inspector.el);
    });

    paper.on("blank:pointerclick", () => {
      if (inspector) inspector.remove();
      inspector = null;
    });

    const rect = new shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 100, height: 50 },
      attrs: {
        label: {
          text: "Hello World",
        },
      },
    });

    graph.addCell(rect);
    paper.unfreeze();

    return () => {
      console.log("Unmounting app...");
      scroller.remove();
      // stencil.remove();
      // paper.remove();
    };
  }, []);

  return (
    <React.Fragment>
      <div className="stencil" ref={stencilEl}></div>
      <div className="canvas" ref={canvasEl}></div>
      <div className="inspector" ref={inspectorEl}></div>
    </React.Fragment>
  );
};

App.whyDidYouRender = true;

export default App;
