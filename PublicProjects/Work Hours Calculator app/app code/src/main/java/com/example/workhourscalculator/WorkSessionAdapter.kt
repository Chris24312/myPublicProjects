package com.example.workhourscalculator

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class WorkSessionAdapter(
    private val items: MutableList<WorkSession>,
    private val onCountChanged: () -> Unit
) : RecyclerView.Adapter<WorkSessionAdapter.ViewHolder>() {

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val line1: TextView = view.findViewById(R.id.tvLine1)
        val line2: TextView = view.findViewById(R.id.tvLine2)
        val duration: TextView = view.findViewById(R.id.tvDuration)
        val btnPlus: Button = view.findViewById(R.id.btnIncrease)
        val btnMinus: Button = view.findViewById(R.id.btnDecrease)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.work_day_item_template, parent, false)
        return ViewHolder(view)
    }

    override fun getItemCount() = items.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val session = items[position]

        holder.line1.text = holder.itemView.context.getString(
            R.string.session_time,
            session.startTime,
            session.endTime
        )
        holder.line2.text = holder.itemView.context.getString(
            R.string.session_break_count,
            session.breakMinutes,
            session.count
        )

        val baseDurationStr = calculateDuration(session.startTime, session.endTime, session.breakMinutes)
        val multipliedDurationStr = multiplyDuration(baseDurationStr, session.count)
        holder.duration.text = multipliedDurationStr

        holder.btnPlus.setOnClickListener {
            session.count++
            notifyItemChanged(position)
            onCountChanged()
        }

        holder.btnMinus.setOnClickListener {
            if (session.count > 1) {
                session.count--
                notifyItemChanged(position)
            } else {
                items.removeAt(position)
                notifyItemRemoved(position)
            }
            onCountChanged()
        }
    }

    private fun calculateDuration(start: String, end: String, breakMin: Int): String {
        val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
        val startTime = sdf.parse(start)
        var endTime = sdf.parse(end)
        if (startTime == null || endTime == null) return "Invalid time"

        if (endTime.before(startTime)) {
            endTime = Date(endTime.time + 24 * 60 * 60 * 1000)
        }

        val durationMillis = endTime.time - startTime.time - (breakMin * 60 * 1000)
        val totalMinutes = durationMillis / (60 * 1000)
        val hours = totalMinutes / 60
        val minutes = totalMinutes % 60
        return "${hours}h ${minutes}m"
    }


    private fun multiplyDuration(durationStr: String, count: Int): String {
        val regex = Regex("""(\d+)h (\d+)m""")
        val match = regex.find(durationStr)
        if (match != null) {
            val (hoursStr, minutesStr) = match.destructured
            var totalMinutes = hoursStr.toInt() * 60 + minutesStr.toInt()
            totalMinutes *= count
            val hours = totalMinutes / 60
            val minutes = totalMinutes % 60
            return "${hours}h ${minutes}m"
        }
        return durationStr
    }
}
