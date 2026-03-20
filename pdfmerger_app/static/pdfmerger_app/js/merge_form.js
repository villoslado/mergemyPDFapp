(function () {
    function mountMergeForm() {
        var rootElement = document.getElementById("merge-form-root");
        if (!rootElement || !window.React || !window.ReactDOM) {
            return;
        }

        var React = window.React;
        var ReactDOM = window.ReactDOM;
        var e = React.createElement;

        function MergeFileInputs() {
            var useState = React.useState;
            var _useState = useState([
                { id: 1, fileName: "" },
                { id: 2, fileName: "" },
            ]);
            var rows = _useState[0];
            var setRows = _useState[1];

            function addFileInput() {
                setRows(function (currentRows) {
                    var ids = currentRows.map(function (row) {
                        return row.id;
                    });
                    var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
                    return currentRows.concat({ id: nextId, fileName: "" });
                });
            }

            function removeFileInput(inputId) {
                setRows(function (currentRows) {
                    if (currentRows.length <= 2) {
                        return currentRows;
                    }

                    return currentRows.filter(function (row) {
                        return row.id !== inputId;
                    });
                });
            }

            function handleFileChange(inputId, event) {
                var file = event.target.files && event.target.files[0];
                var fileName = file ? file.name : "";

                setRows(function (currentRows) {
                    return currentRows.map(function (row) {
                        if (row.id !== inputId) {
                            return row;
                        }

                        return {
                            id: row.id,
                            fileName: fileName,
                        };
                    });
                });
            }

            var fields = [];

            for (var index = 0; index < rows.length; index += 1) {
                var row = rows[index];
                var inputId = row.id;
                var inputNumber = index + 1;

                fields.push(
                    e(
                        "div",
                        {
                            className:
                                "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm",
                            key: inputId,
                        },
                        e(
                            "div",
                            {
                                className:
                                    "mb-3 flex items-center justify-between gap-3",
                            },
                            e(
                                "label",
                                {
                                    htmlFor: "file" + inputId,
                                    className: "text-sm font-medium text-slate-800",
                                },
                                "PDF file " + inputNumber
                            ),
                            rows.length > 2
                                ? e(
                                      "button",
                                      {
                                          type: "button",
                                          className:
                                              "inline-flex items-center justify-center rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-50",
                                          onClick: (function (id) {
                                              return function () {
                                                  removeFileInput(id);
                                              };
                                          })(inputId),
                                      },
                                      "Remove"
                                  )
                                : null
                        ),
                        e("input", {
                            id: "file" + inputId,
                            type: "file",
                            className:
                                "block w-full rounded-xl border-slate-300 bg-white text-sm text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-medium file:text-brand-700 hover:file:bg-brand-100 focus:border-brand-500 focus:ring-brand-500",
                            name: "files",
                            accept: "application/pdf",
                            required: true,
                            onChange: (function (id) {
                                return function (event) {
                                    handleFileChange(id, event);
                                };
                            })(inputId),
                        }),
                        row.fileName
                            ? e(
                                  "div",
                                  {
                                      className:
                                          "mt-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200",
                                  },
                                  "Selected file: " + row.fileName
                              )
                            : e(
                                  "div",
                                  {
                                      className:
                                          "mt-3 text-sm text-slate-500",
                                  },
                                  "No file selected yet."
                              )
                    )
                );
            }

            fields.push(
                e(
                    "button",
                    {
                        type: "button",
                        className:
                            "inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-brand-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50",
                        onClick: addFileInput,
                        key: "add-button",
                    },
                    "Add another PDF"
                )
            );

            return e("div", { className: "space-y-4" }, fields);
        }

        ReactDOM.createRoot(rootElement).render(e(MergeFileInputs));
    }

    window.addEventListener("DOMContentLoaded", mountMergeForm);
})();
