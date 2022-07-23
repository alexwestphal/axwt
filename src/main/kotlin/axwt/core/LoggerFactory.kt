package axwt.core

import org.glassfish.hk2.api.Factory
import org.glassfish.hk2.api.InstantiationService
import org.glassfish.hk2.utilities.binding.AbstractBinder
import org.slf4j.Logger
import org.slf4j.LoggerFactory as SLF4JLoggerFactory
import javax.inject.Inject

class LoggerFactory @Inject constructor(private val instantiationService: InstantiationService): Factory<Logger> {

    override fun provide(): Logger {
        val injectee = instantiationService.instantiationData.parentInjectee
        return SLF4JLoggerFactory.getLogger(injectee.injecteeClass)
    }

    override fun dispose(instance: Logger) {}

    class Binder: AbstractBinder() {
        override fun configure() {
            bindFactory(LoggerFactory::class.java).to(Logger::class.java)
        }

    }
}