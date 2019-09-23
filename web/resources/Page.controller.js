/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-shadow:0*/
/*eslint-env es6 */
sap.ui.define(["sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/core/mvc/Controller"],
	function (MessageToast, MessageBox, Controller) {
		"use strict";

		function ongetJobStatus(myJSON) {
			try {
				var result = JSON.parse(myJSON);
				console.log(result);

				var lastBuild = result.lastBuild;
				var lastCompletedBuild = result.lastCompletedBuild;
				console.log(lastBuild + ":" + lastCompletedBuild);
				
				//true = job is not running; false = job is running
				if(lastBuild === null && lastCompletedBuild === null) {
					return true;
				} else if(lastBuild !== null && lastCompletedBuild === null) {
					return false;
				} else if(lastBuild !== null && lastCompletedBuild !== null) {
					lastBuild = result.lastBuild.number;
					lastCompletedBuild = result.lastCompletedBuild.number;
				

					if (lastBuild === lastCompletedBuild) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}

			} catch (e) {
				return "";
			}
		}

		function getJobStatus() {
			var aUrl = "/node/statusJob";

			return ongetJobStatus(
				jQuery.ajax({
					url: aUrl,
					method: "GET",
					dataType: "json",
					async: false
				}).responseText);
		}

		function ontriggerJob(myJSON) {
			try {
				var result = JSON.parse(myJSON);
				console.log(result);
				return (result.queue);
			} catch (e) {
				return "";
			}
		}

		function triggerJob() {
			var aUrl = "/node/triggerJob";

			return ontriggerJob(
				jQuery.ajax({
					url: aUrl,
					method: "GET",
					dataType: "json",
					async: false
				}).responseText);
		}

		function ongetcurrentJobqueue(myJSON) {
			try {
				var result = JSON.parse(myJSON);
				console.log(result);

				var lastBuild = result.lastBuild.number;
				return lastBuild;

			} catch (e) {
				return "";
			}
		}

		function getcurrentJobqueue() {
			var aUrl = "/node/statusJob";

			return ongetcurrentJobqueue(
				jQuery.ajax({
					url: aUrl,
					method: "GET",
					dataType: "json",
					async: false
				}).responseText);
		}

		function oncancelJob(myJSON) {
			try {
				var result = JSON.parse(myJSON);
				console.log(result);

				return (result.status);

			} catch (e) {
				return "";
			}
		}

		function cancelJob(jobqueue) {
			var aUrl = "/node/cancelJob?q=" + jobqueue;

			return oncancelJob(
				jQuery.ajax({
					url: aUrl,
					method: "GET",
					dataType: "json",
					async: false
				}).responseText);
		}

		var PageController = Controller.extend("sap.m.sample.Button.Page", {

			onPress_triggerjob: function (evt) {

				let jobstatus = getJobStatus();
				console.log(jobstatus);
				if (jobstatus) {

					let jobqueuenumber = triggerJob();
					console.log(jobqueuenumber);
					MessageBox.information("Job number:" + jobqueuenumber, {
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								console.log("OK");
							}
						}
					});
				} else {
					MessageBox.information("Please wait. Job is still running", {
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								console.log("OK");
							}
						}
					});
				}
			},

			onPress_checkjob: function (evt) {

				let jobstatus = getJobStatus();
				console.log(jobstatus);
				if (jobstatus) {
					MessageBox.information("Job is not running", {
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								console.log("OK");
							}
						}
					});
				} else {
					MessageBox.information("Job is still running", {
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								console.log("OK");
							}
						}
					});
				}
			},

			onPress_canceljob: function (evt) {
				let jobqueue = getcurrentJobqueue();
				let status = cancelJob(jobqueue);
				console.log(status);

				MessageBox.information("Job has been cancelled", {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							console.log("OK");
						}
					}
				});
			}
		});

		return PageController;

	});