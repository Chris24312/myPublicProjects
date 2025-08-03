package com.example.workhourscalculator

data class WorkSession(
    val startTime: String,
    val endTime: String,
    val breakMinutes: Int = 60,
    var count: Int = 1
)
