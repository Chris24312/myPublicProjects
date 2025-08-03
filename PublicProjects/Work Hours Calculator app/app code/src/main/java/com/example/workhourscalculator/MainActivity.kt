package com.example.workhourscalculator

import android.app.TimePickerDialog
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import java.util.Calendar
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import android.graphics.Color
import android.view.View


class MainActivity : AppCompatActivity() {

    private lateinit var adapter: WorkSessionAdapter
    private val sessions = mutableListOf<WorkSession>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        window.statusBarColor = Color.TRANSPARENT

        val recyclerView = findViewById<RecyclerView>(R.id.RVItemList)
        recyclerView.layoutManager = LinearLayoutManager(this)

        adapter = WorkSessionAdapter(sessions) {
            updateTotalTime()
        }
        recyclerView.adapter = adapter

        val btnAdd = findViewById<Button>(R.id.btnAdd)
        btnAdd.setOnClickListener {
            pickStartTime()
        }

        val btnClear = findViewById<Button>(R.id.btnClear)
        btnClear.setOnClickListener {
            clearAllSessions()
        }
    }

    private var startHour = 0
    private var startMinute = 0
    private var endHour = 0
    private var endMinute = 0
    private var breakMinutes = 60

    private fun pickStartTime() {
        val cal = Calendar.getInstance()
        val timePicker = TimePickerDialog(this, { _, hour, minute ->
            startHour = hour
            startMinute = minute
            pickEndTime()
        }, cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE), true)
        timePicker.setTitle("Start Time")
        timePicker.show()
    }

    private fun pickEndTime() {
        val cal = Calendar.getInstance()
        val timePicker = TimePickerDialog(this, { _, hour, minute ->
            endHour = hour
            endMinute = minute
            pickBreakTime()
        }, cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE), true)
        timePicker.setTitle("End Time")
        timePicker.show()
    }

    private fun pickBreakTime() {
        val startTimeStr = String.format("%02d:%02d", startHour, startMinute)
        val endTimeStr = String.format("%02d:%02d", endHour, endMinute)

        val newSession = WorkSession(
            startTime = startTimeStr,
            endTime = endTimeStr,
            breakMinutes = breakMinutes,
            count = 1
        )
        sessions.add(newSession)
        adapter.notifyItemInserted(sessions.size - 1)
        updateTotalTime()
    }

    private fun updateTotalTime() {
        var totalMinutes = 0
        val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())

        for (session in sessions) {
            val start = sdf.parse(session.startTime)
            var end = sdf.parse(session.endTime)

            if (start != null && end != null) {
                if (end.before(start)) {
                    end = Date(end.time + 24 * 60 * 60 * 1000)
                }

                val durationMillis = end.time - start.time - (session.breakMinutes * 60 * 1000)
                val durationMinutes = (durationMillis / (60 * 1000)).toInt()
                totalMinutes += durationMinutes * session.count
            }
        }

        val hours = totalMinutes / 60
        val minutes = totalMinutes % 60

        val totalText = if (totalMinutes <= 0) "Welcome!" else "${hours}h ${minutes}m"
        findViewById<TextView>(R.id.tvTotalCount).text = totalText
    }


    private fun clearAllSessions() {
        sessions.clear()
        adapter.notifyDataSetChanged()
        updateTotalTime()
    }

}
