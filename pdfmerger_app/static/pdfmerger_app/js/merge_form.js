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
            var _useState = useState([1]);
            var inputIds = _useState[0];
            var setInputIds = _useState[1];

            function addFileInput() {
                setInputIds(function (ids) {
                    var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
                    return ids.concat(nextId);
                });
            }

            function removeFileInput(inputId) {
                setInputIds(function (ids) {
                    if (ids.length <= 1) {
                        return ids;
                    }

                    return ids.filter(function (id) {
                        return id !== inputId;
                    });
                });
            }

            var fields = [];

            for (var index = 0; index < inputIds.length; index += 1) {
                var inputId = inputIds[index];
                var inputNumber = index + 1;

                fields.push(
                    e(
                        "div",
                        { className: "mb-3", key: inputId },
                        e(
                            "div",
                            { className: "d-flex justify-content-between align-items-center mb-2" },
                            e(
                                "label",
                                {
                                    htmlFor: "file" + inputId,
                                    className: "form-label mb-0",
                                },
                                "Upload PDF " + inputNumber
                            ),
                            inputIds.length > 1
                                ? e(
                                      "button",
                                      {
                                          type: "button",
                                          className: "btn btn-outline-danger btn-sm",
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
                            className: "form-control",
                            name: "files",
                            accept: "application/pdf",
                            required: true,
                        })
                    )
                );
            }

            fields.push(
                e(
                    "button",
                    {
                        type: "button",
                        className: "btn btn-secondary me-2",
                        onClick: addFileInput,
                        key: "add-button",
                    },
                    "Add Another File"
                )
            );

            return e(React.Fragment, null, fields);
        }

        ReactDOM.createRoot(rootElement).render(e(MergeFileInputs));
    }

    window.addEventListener("DOMContentLoaded", mountMergeForm);
})();
