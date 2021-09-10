/*
 * Copyright (c) 2010-2021 SAP SE or an SAP affiliate company and Eclipse Dirigible contributors
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-FileCopyrightText: 2010-2021 SAP SE or an SAP affiliate company and Eclipse Dirigible contributors
 * SPDX-License-Identifier: EPL-2.0
 */
let editorView = angular.module('image-app', []);


editorView.controller('ImageViewController', ['$scope', '$http', function ($scope, $http) {
    let csrfToken;
    $scope.dataLoaded = false;

    $scope.checkResource = function (resourcePath) {
        if (resourcePath != "") {
            let xhr = new XMLHttpRequest();
            xhr.open('HEAD', `../../../../../../services/v4/ide/workspaces${resourcePath}`, false);
            xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
            xhr.send();
            if (xhr.status === 200) {
                csrfToken = xhr.getResponseHeader("x-csrf-token");
                $scope.fileExists = true;
            } else {
                $scope.fileExists = false;
            }
        } else {
            $scope.fileExists = false;
        }
        return $scope.fileExists;
    };

    function loadFileContents() {
        let searchParams = new URLSearchParams(window.location.search);
        $scope.file = searchParams.get('file');
        if ($scope.file) {
            $http.get('../../../../../../services/v4/ide/workspaces' + $scope.file)
                .then(function (response) {
                    let contents = response.data;
                    console.log(contents);
                    $scope.dataLoaded = true;
                }, function (response) {
                    if (response.data) {
                        if ("error" in response.data) {
                            console.error("Loading file:", response.data.error.message);
                        }
                    }
                });
        } else {
            console.error('file parameter is not present in the URL');
        }
    }

    loadFileContents();

}]);